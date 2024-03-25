import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { ADD_EXERCISE } from 'src/config/steps';
import { ExercisesSceneContext } from 'src/config/types';
import { Markup } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';

@Scene(ADD_EXERCISE.CHOOSE_EXERCISE_TYPE)
export class ChooseExerciseTypeScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext) {
    const bodyParts = await this.prisma.exerciseType.findMany();
    const keyboardOptions = bodyParts.map((type) => [
      Markup.button.callback(type.name, `choose_${type.id}`),
    ]);
    keyboardOptions.push([
      Markup.button.callback(ADD_EXERCISE.ADD_EXERCISE_TYPE, 'add'),
    ]);
    await ctx.reply(
      'Выберите категорию:',
      Markup.inlineKeyboard(keyboardOptions),
    );
  }

  @Action(/choose_(.+)/)
  async choose(@Ctx() ctx: ExercisesSceneContext) {
    // @ts-expect-error match
    const typeId = ctx.match[1];
    ctx.session.exerciseTypeId = parseInt(typeId);
    ctx.scene.enter(ADD_EXERCISE.CHOOSE_BODY_PART);
  }

  @Action('add')
  async add(@Ctx() ctx: SceneContext) {
    ctx.scene.enter(ADD_EXERCISE.ADD_EXERCISE_TYPE);
  }
}
