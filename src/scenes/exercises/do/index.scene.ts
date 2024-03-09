import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { EXERCISES } from 'src/config/actions';
import { DO } from 'src/config/steps';
import { SceneContext } from 'telegraf/typings/scenes';

@Scene(EXERCISES.DO)
export class DoExercise {
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext) {
    ctx.scene.enter(DO.CHOOSE_EXERCISE_TYPE);
  }
}
