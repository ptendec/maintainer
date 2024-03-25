import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { GYM_ADD_EXERCISE_STEPS } from 'src/config/steps';
import { GymSceneContext } from 'src/config/types';

@Scene(GYM_ADD_EXERCISE_STEPS.CHOOSE_DAY_FOR_EXERCISE)
export class ChooseDayForExerciseScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: GymSceneContext) {
    const results = await this.prisma.day.findMany({
      where: {
        programId: ctx.session.programId,
      },
    });
    ctx.reply('Выберите день', {
      reply_markup: {
        inline_keyboard: results.map((result) => [
          {
            text: result.name,
            callback_data: `id:${result.id}`,
          },
        ]),
      },
    });
  }

  @Action(/id:(\d+)/)
  async onAction(@Ctx() ctx: GymSceneContext) {
    // @ts-expect-error match
    const id = ctx.match[1];
    ctx.session.dayId = Number(id);
    ctx.scene.enter(GYM_ADD_EXERCISE_STEPS.CHOOSE_STAGE_FOR_EXERCISE);
  }
}
