import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { GYM_ADD_STAGE_STEPS, GYM_ADD_STEPS } from 'src/config/steps';
import { SceneContext } from 'telegraf/typings/scenes';

@Scene(GYM_ADD_STEPS.ADD_STAGE)
export class AddStageSceneEntry {
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext) {
    ctx.scene.enter(GYM_ADD_STAGE_STEPS.CHOOSE_PROGRAM_FOR_STAGE);
  }
}
