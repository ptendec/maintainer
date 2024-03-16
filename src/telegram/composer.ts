import { Composer, Ctx, Hears, Start } from 'nestjs-telegraf';
import { ACTIONS } from 'src/config/actions';
import { PrismaService } from 'src/prisma/prisma.service';
import { Markup } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';

@Composer()
export class ComposerCommon {
  constructor(private readonly prisma: PrismaService) {}

  @Hears('wizard')
  enterFunc(@Ctx() ctx: SceneContext) {
    ctx.scene.enter('wizard');
  }

  @Start()
  async start(@Ctx() ctx: SceneContext) {
    // TODO Переписать на middleware
    ctx.scene.leave();
    if (!ctx.from?.id) return;
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          id: BigInt(ctx.from.id),
        },
      });
      if (!existingUser)
        await this.prisma.user.create({
          data: {
            id: BigInt(ctx.from.id),
            username: ctx.message?.from.username,
            firstName: ctx.message?.from.first_name,
            lastName: ctx.message?.from.last_name,
            chatId: ctx.message?.chat?.id,
          },
        });
    } catch (error) {
      console.log(error);
    }
    await ctx.reply(
      'Выбирайте',
      Markup.keyboard([ACTIONS.EXERCISES, ACTIONS.GYM]).resize(),
    );
  }
}
