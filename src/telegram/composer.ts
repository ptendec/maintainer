import { Composer, Ctx, Hears, Start } from 'nestjs-telegraf';
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

  @Hears(ACTIONS[0].name)
  async add(@Ctx() ctx: SceneContext) {
    const actions = ADD.map((action) => action.name);
    await ctx.reply('Выбирайте', Markup.keyboard([actions]).resize());
  }

  @Hears(ACTIONS[1].name)
  async do(@Ctx() ctx: SceneContext) {
    const actions = DO.map((action) => action.name);
    await ctx.reply('Выбирайте', Markup.keyboard([actions]).resize());
  }

  @Hears(DO[0].name)
  async doExercises(@Ctx() ctx: SceneContext) {
    ctx.scene.enter(DO[0].id);
  }

  @Hears(DO[1].name)
  async doGym(@Ctx() ctx: SceneContext) {
    ctx.scene.enter(DO[1].id);
  }

  @Hears(ADD[0].name)
  async addExercises(@Ctx() ctx: SceneContext) {
    ctx.scene.enter(ADD[0].id);
  }

  @Hears(ADD[1].name)
  async addGym(@Ctx() ctx: SceneContext) {
    ctx.scene.enter(ADD[1].id);
  }
}
