import { Composer, Ctx, On, Start } from 'nestjs-telegraf';
import { ACTIONS, ADD, DO } from 'src/config/actions';
import { PrismaService } from 'src/prisma/prisma.service';
import { Markup } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';

@Composer()
export class ComposerCommon {
  constructor(private readonly prisma: PrismaService) {}

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
    const actions = ACTIONS.map((action) => action.name);
    await ctx.reply('Выбирайте', Markup.keyboard([actions]).resize());
  }

  @On('text')
  async onText(@Ctx() ctx: SceneContext) {
    const found = [...ACTIONS, ...ADD, ...DO].find(
      (action) => action.name === ctx.text,
    );
    found && ctx.scene.enter(found.id);
  }
}
