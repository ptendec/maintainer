import { Ctx, Hears, Update } from 'nestjs-telegraf';
import { ACTIONS, EXERCISES, GYM } from 'src/config/actions';
import { GYM_ADD_STEPS } from 'src/config/steps';
import { Context, Markup } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';

@Update()
export class CommonUpdate {
  @Hears(ACTIONS.EXERCISES)
  async exercisesActions(@Ctx() ctx: Context) {
    await ctx.reply(
      'Выберите',
      Markup.keyboard([EXERCISES.ADD, EXERCISES.DO]).resize(),
    );
  }

  @Hears(ACTIONS.GYM)
  async gymActions(@Ctx() ctx: Context) {
    await ctx.reply('Выберите', Markup.keyboard([GYM.ADD, GYM.DO]).resize());
  }

  @Hears(EXERCISES.ADD)
  async addbodyPartsceneEnter(@Ctx() ctx: SceneContext) {
    ctx.scene.enter(EXERCISES.ADD);
  }

  @Hears(EXERCISES.DO)
  async startExercise(@Ctx() ctx: SceneContext) {
    ctx.scene.enter(EXERCISES.DO);
  }

  @Hears(GYM.ADD)
  async addGym(@Ctx() ctx: SceneContext) {
    ctx.reply(
      'Что добавить?',
      Markup.keyboard([
        GYM_ADD_STEPS.ADD_PROGRAM_GENERAL,
        GYM_ADD_STEPS.ADD_DAY_GENERAL,
        GYM_ADD_STEPS.ADD_EXERCISE_GENERAL,
        GYM_ADD_STEPS.ADD_STAGE_GENERAL,
      ]).resize(),
    );
  }

  @Hears(GYM_ADD_STEPS.ADD_DAY_GENERAL)
  async addDay(@Ctx() ctx: SceneContext) {
    ctx.scene.enter(GYM_ADD_STEPS.ADD_DAY_GENERAL);
  }

  @Hears(GYM_ADD_STEPS.ADD_EXERCISE_GENERAL)
  async addExercise(@Ctx() ctx: SceneContext) {
    ctx.scene.enter(GYM_ADD_STEPS.ADD_EXERCISE_GENERAL);
  }

  @Hears(GYM_ADD_STEPS.ADD_STAGE_GENERAL)
  async addStage(@Ctx() ctx: SceneContext) {
    ctx.scene.enter(GYM_ADD_STEPS.ADD_STAGE_GENERAL);
  }

  @Hears(GYM_ADD_STEPS.ADD_PROGRAM_GENERAL)
  async addProgram(@Ctx() ctx: SceneContext) {
    ctx.scene.enter(GYM_ADD_STEPS.ADD_PROGRAM_GENERAL);
  }

  @Hears(GYM.DO)
  async doGym(@Ctx() ctx: SceneContext) {
    ctx.scene.enter(GYM.DO);
  }
}
