import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { GYM_ADD_EXERCISE_STEPS } from 'src/config/steps';
import { GymSceneContext } from 'src/config/types';
import { PrismaService } from 'src/prisma/prisma.service';

@Scene(GYM_ADD_EXERCISE_STEPS.CHOOSE_STAGE_FOR_EXERCISE)
export class ChooseStageForExerciseScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: GymSceneContext) {
    const results = await this.prisma.stage.findMany({
      where: {
        dayId: ctx.session.dayId,
      },
    });
    ctx.reply('Выберите этап', {
      reply_markup: {
        inline_keyboard: results.map((item) => [
          {
            text: item.name,
            callback_data: `id:${item.id}`,
          },
        ]),
      },
    });
  }

  @Action(/id:(\d+)/)
  async onAction(@Ctx() ctx: GymSceneContext) {
    // @ts-expect-error match
    const id = ctx.match[1];
    ctx.session.stageId = Number(id);
    ctx.scene.enter(GYM_ADD_EXERCISE_STEPS.ADD_EXERCISE);
  }
}
