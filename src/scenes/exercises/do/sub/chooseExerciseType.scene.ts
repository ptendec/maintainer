import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { DO_EXERCISE } from 'src/config/steps';
import { ExercisesSceneContext } from 'src/config/types';
import { Markup } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';

@Scene(DO_EXERCISE.CHOOSE_EXERCISE_TYPE)
export class DoChooseExerciseTypeScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext) {
    const exerciseTypes = await this.prisma.exerciseType.findMany();
    const keyboardOptions = exerciseTypes.map((type) => [
      Markup.button.callback(type.name, `choose_${type.id}`),
    ]);
    await ctx.reply(
      'Выберите тип упражнений:',
      Markup.inlineKeyboard(keyboardOptions),
    );
  }

  @Action(/choose_(.+)/)
  async chooseExerciseType(@Ctx() ctx: ExercisesSceneContext) {
    // @ts-expect-error match
    const typeId = ctx.match[1];
    ctx.session.exerciseTypeId = parseInt(typeId);
    ctx.scene.enter(DO_EXERCISE.CHOOSE_BODY_PART);
  }
}
