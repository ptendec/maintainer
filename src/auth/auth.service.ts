import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto'; // Убедитесь, что путь до DTO корректен

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        password: hashedPassword,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async validateUser(email: string, pass: string): Promise<UserDto | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: { id: number; email: string }) {
    const userEntity = await this.prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!userEntity) {
      throw new Error('User not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = userEntity;
    const userDto: UserDto = userWithoutPassword;

    const payload = { ...userDto };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '60s',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '30d',
    });

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken, user: userDto };
  }

  async refreshToken(oldRefreshToken: string) {
    try {
      const payload = this.jwtService.verify(oldRefreshToken, {
        secret: process.env.JWT_SECRET,
      });
      const tokenInDb = await this.prisma.refreshToken.findUnique({
        where: { token: oldRefreshToken },
      });
      if (!tokenInDb || tokenInDb.expires < new Date()) {
        throw new Error('Invalid token');
      }
      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const newAccessToken = this.jwtService.sign(
        { email: user.email, id: user.id },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '60s',
        },
      );

      const newRefreshToken = this.jwtService.sign(
        { email: user.email, id: user.id },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '30d',
        },
      );

      await this.prisma.refreshToken.update({
        where: { id: tokenInDb.id },
        data: {
          token: newRefreshToken,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new Error('Refresh token is invalid or has expired');
    }
  }
}
