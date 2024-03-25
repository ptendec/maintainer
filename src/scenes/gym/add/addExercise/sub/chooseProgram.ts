import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { GYM_ADD_EXERCISE_STEPS } from 'src/config/steps';
import { GymSceneContext } from 'src/config/types';
import { SceneContext } from 'telegraf/typings/scenes';

@Scene(GYM_ADD_EXERCISE_STEPS.CHOOSE_PROGRAM_FOR_EXERCISE)
export class ChooseProgramForExerciseScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext) {
    const results = await this.prisma.program.findMany();
    ctx.reply('Выберите программу', {
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
  async action(@Ctx() ctx: GymSceneContext) {
    // @ts-expect-error match
    const id = ctx.match[1];
    ctx.session.programId = Number(id);
    ctx.scene.enter(GYM_ADD_EXERCISE_STEPS.CHOOSE_DAY_FOR_EXERCISE);
  }
}
