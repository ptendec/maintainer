import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { DO } from 'src/config/actions';
import { GYM_DO_STEPS } from 'src/config/steps';
import { SceneContext } from 'telegraf/typings/scenes';

@Scene(DO[1].id)
export class DoGymScene {
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext) {
    ctx.scene.enter(GYM_DO_STEPS.CHOOSE_PROGRAM);
  }
}
