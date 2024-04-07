import { Composer, Ctx, Hears, Start } from 'nestjs-telegraf';
import { ACTIONS } from 'src/config/actions';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { Markup } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';

@Composer()
export class ComposerCommon {
  constructor(private readonly prisma: PrismaService) {}

  @Start()
  async start(@Ctx() ctx: SceneContext) {
    // TODO Переписать на middleware авторизацию
    ctx.scene.leave();
    if (!ctx.from?.id) return;
    await ctx.reply(
      'Выбирайте',
      Markup.keyboard([ACTIONS.DO_EXERCISE, ACTIONS.DO_GYM]).resize(),
    );
  }

  @Hears(ACTIONS.DO_EXERCISE)
  async doExercise(@Ctx() ctx: SceneContext) {
    ctx.scene.enter(ACTIONS.DO_EXERCISE);
  }

  @Hears(ACTIONS.DO_GYM)
  async doGym(@Ctx() ctx: SceneContext) {
    ctx.scene.enter(ACTIONS.DO_GYM);
  }
}
