import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { GYM_ADD_EXERCISE_STEPS, GYM_ADD_STEPS } from 'src/config/steps';
import { SceneContext } from 'telegraf/typings/scenes';

@Scene(GYM_ADD_STEPS.ADD_EXERCISE_GENERAL)
export class AddExerciseSceneEntry {
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext) {
    ctx.scene.enter(GYM_ADD_EXERCISE_STEPS.CHOOSE_PROGRAM_FOR_EXERCISE);
  }
}
