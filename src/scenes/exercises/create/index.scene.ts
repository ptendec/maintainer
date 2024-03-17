import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { ADD } from 'src/config/actions';
import { ADD_EXERCISE } from 'src/config/steps';
import { SceneContext } from 'telegraf/typings/scenes';

@Scene(ADD[0].id)
export class AddExerciseTypeSceneEntry {
  @SceneEnter()
  async onEnter(@Ctx() ctx: SceneContext) {
    ctx.scene.enter(ADD_EXERCISE.CHOOSE_EXERCISE_TYPE);
  }
}
