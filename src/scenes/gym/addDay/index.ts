import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { GYM_ADD_DAY_STEPS, GYM_ADD_STEPS } from 'src/config/steps';
import { SceneContext } from 'telegraf/typings/scenes';

@Scene(GYM_ADD_STEPS.ADD_DAY_GENERAL)
export class AddDaySceneEntry {
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext) {
    ctx.scene.enter(GYM_ADD_DAY_STEPS.CHOOSE_PROGRAM_FOR_DAY);
  }
}
