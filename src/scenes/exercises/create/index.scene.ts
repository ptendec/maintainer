import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { EXERCISES } from 'src/config/actions';
import { ADD } from 'src/config/steps';
import { SceneContext } from 'telegraf/typings/scenes';

@Scene(EXERCISES.ADD)
export class AddExerciseTypeSceneEntry {
  @SceneEnter()
  async onEnter(@Ctx() ctx: SceneContext) {
    ctx.scene.enter(ADD.CHOOSE_EXERCISE_TYPE);
  }
}
