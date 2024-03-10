import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { GYM_ADD_STAGE_STEPS } from 'src/config/steps';
import { GymSceneContext } from 'src/config/types';
import { PrismaService } from 'src/prisma/prisma.service';

@Scene(GYM_ADD_STAGE_STEPS.CHOOSE_DAY_FOR_STAGE)
export class ChooseDayForStageScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: GymSceneContext) {
    const results = await this.prisma.day.findMany({
      where: {
        programId: ctx.session.programId,
      },
    });
    ctx.reply('Выберите день', {
      reply_markup: {
        inline_keyboard: results.map((result) => [
          {
            text: result.name,
            callback_data: `id:${result.id}`,
          },
        ]),
      },
    });
  }

  @Action(/id:(\d+)/)
  async addStageAction(@Ctx() ctx: GymSceneContext) {
    // @ts-expect-error match
    const id = ctx.match[1];
    ctx.session.dayId = Number(id);
    ctx.scene.enter(GYM_ADD_STAGE_STEPS.ADD_STAGE);
  }
}
