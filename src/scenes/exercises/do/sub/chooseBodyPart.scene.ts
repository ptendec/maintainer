import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { DO_EXERCISE } from 'src/config/steps';
import { ExercisesSceneContext } from 'src/config/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { Markup } from 'telegraf';

@Scene(DO_EXERCISE.CHOOSE_BODY_PART)
export class DoChooseBodyPartScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: ExercisesSceneContext) {
    const bodyParts = await this.prisma.bodyPart.findMany({
      where: { exerciseTypeId: ctx.session.exerciseTypeId },
    });
    const keyboardOptions = bodyParts.map((part) => [
      Markup.button.callback(part.name, `choose_${part.id}`),
    ]);
    await ctx.reply(
      'Выберите часть тела:',
      Markup.inlineKeyboard(keyboardOptions),
    );
  }

  @Action(/choose_(.+)/)
  async chooseBodyPart(@Ctx() ctx: ExercisesSceneContext) {
    // @ts-expect-error match
    const bodyPartId = ctx.match[1];
    ctx.session.bodyPartId = parseInt(bodyPartId);
    ctx.scene.enter(DO_EXERCISE.VIEW_VIDEOS);
  }
}
