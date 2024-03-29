import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { GYM_DO_STEPS } from 'src/config/steps';
import { GymSceneContext } from 'src/config/types';
import { Markup } from 'telegraf';

@Scene(GYM_DO_STEPS.CHOOSE_DAY)
export class ChooseDayScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: GymSceneContext) {
    const days = await this.prisma.day.findMany();
    const keyboardOptions = days.map((part) => [
      Markup.button.callback(part.name, `choose_${part.id}`),
    ]);
    await ctx.reply(
      'Выберите день тренировок:',
      Markup.inlineKeyboard(keyboardOptions),
    );
  }

  @Action(/choose_(.+)/)
  async chooseDay(@Ctx() ctx: GymSceneContext) {
    // @ts-expect-error match
    const dayId = ctx.match[1];
    ctx.session.dayId = parseInt(dayId);
    ctx.scene.enter(GYM_DO_STEPS.START);
  }
}
