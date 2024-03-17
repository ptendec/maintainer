import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { ADD } from 'src/config/actions';
import { GYM_ADD_STEPS } from 'src/config/steps';
import { Markup } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';

@Scene(ADD[1].id)
export class AddGym {
  @SceneEnter()
  async sceneEnter(@Ctx() ctx: SceneContext) {
    ctx.reply(
      'Что добавить?',
      Markup.keyboard([
        GYM_ADD_STEPS.ADD_PROGRAM,
        GYM_ADD_STEPS.ADD_DAY,
        GYM_ADD_STEPS.ADD_EXERCISE,
        GYM_ADD_STEPS.ADD_STAGE,
      ]).resize(),
    );
  }

  @Hears(GYM_ADD_STEPS.ADD_DAY)
  async addDay(@Ctx() ctx: SceneContext) {
    ctx.scene.enter(GYM_ADD_STEPS.ADD_DAY);
  }

  @Hears(GYM_ADD_STEPS.ADD_EXERCISE)
  async addExercise(@Ctx() ctx: SceneContext) {
    ctx.scene.enter(GYM_ADD_STEPS.ADD_EXERCISE);
  }

  @Hears(GYM_ADD_STEPS.ADD_STAGE)
  async addStage(@Ctx() ctx: SceneContext) {
    ctx.scene.enter(GYM_ADD_STEPS.ADD_STAGE);
  }

  @Hears(GYM_ADD_STEPS.ADD_PROGRAM)
  async addProgram(@Ctx() ctx: SceneContext) {
    ctx.scene.enter(GYM_ADD_STEPS.ADD_PROGRAM);
  }
}
