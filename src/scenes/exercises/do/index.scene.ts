import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { DO } from 'src/config/actions';
import { DO_EXERCISE } from 'src/config/steps';
import { SceneContext } from 'telegraf/typings/scenes';

@Scene(DO[0].id)
export class DoExercise {
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext) {
    ctx.scene.enter(DO_EXERCISE.CHOOSE_EXERCISE_TYPE);
  }
}
