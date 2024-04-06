import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class LoginUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class LoginUserResDto {
  @ApiProperty()
  user: UserDto;

  @ApiProperty()
  accessToken: string;
}
