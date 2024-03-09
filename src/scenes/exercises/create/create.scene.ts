import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { ADD, EXERCISES } from 'src/config/steps';
import { SceneContext } from 'telegraf/typings/scenes';

@Scene(EXERCISES.ADD)
export class AddExerciseScene {
  @SceneEnter()
  async onEnter(@Ctx() ctx: SceneContext) {
    ctx.scene.enter(ADD.CHOOSE_EXERCISE_TYPE);
  }
}
