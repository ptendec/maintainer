import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { GYM_DO_STEPS } from 'src/config/steps';
import { GymSceneContext } from 'src/config/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { Markup } from 'telegraf';

@Scene(GYM_DO_STEPS.CHOOSE_PROGRAM)
export class ChooseProgramScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: GymSceneContext) {
    const programs = await this.prisma.program.findMany();
    const keyboardOptions = programs.map((part) => [
      Markup.button.callback(part.name, `choose_${part.id}`),
    ]);
    await ctx.reply(
      'Выберите программу тренировок:',
      Markup.inlineKeyboard(keyboardOptions),
    );
  }

  @Action(/choose_(.+)/)
  async chooseDay(@Ctx() ctx: GymSceneContext) {
    // @ts-expect-error match
    const dayId = ctx.match[1];
    ctx.session.programId = parseInt(dayId);
    ctx.scene.enter(GYM_DO_STEPS.CHOOSE_DAY);
  }
}
