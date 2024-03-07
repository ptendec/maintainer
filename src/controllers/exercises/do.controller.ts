import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Session } from 'src/bot/telegram.controller';
import { DO, EXERCISES } from 'src/config/steps';
import { PrismaService } from 'src/prisma/prisma.service';
import { Context, Markup } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';

@Scene(EXERCISES.DO)
export class DoExercise {
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext<Context>) {
    ctx.scene.enter(DO.CHOOSE_EXERCISE_TYPE);
  }
}

@Scene(DO.CHOOSE_EXERCISE_TYPE)
export class DoChooseExerciseTypeScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext<Context>) {
    const exerciseTypes = await this.prisma.exerciseType.findMany();
    const keyboardOptions = exerciseTypes.map((type) => [
      Markup.button.callback(type.name, `choose_${type.id}`),
    ]);
    await ctx.reply(
      'Выберите тип упражнений:',
      Markup.inlineKeyboard(keyboardOptions),
    );
  }

  @Action(/choose_(.+)/)
  async chooseExerciseType(
    @Ctx() ctx: SceneContext<Context> & { session: Session },
  ) {
    // @ts-expect-error match
    const typeId = ctx.match[1];
    ctx.session.exerciseTypeId = parseInt(typeId);
    ctx.scene.enter(DO.CHOOSE_BODY_PART);
  }
}

@Scene(DO.CHOOSE_BODY_PART)
export class DoChooseBodyPartScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(
    @Ctx() ctx: SceneContext<Context> & { session: { exerciseTypeId: number } },
  ) {
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
  async chooseBodyPart(
    @Ctx() ctx: SceneContext<Context> & { session: Session },
  ) {
    // @ts-expect-error match
    const bodyPartId = ctx.match[1];
    ctx.session.bodyPartId = parseInt(bodyPartId);
    ctx.scene.enter(DO.VIEW_VIDEOS);
  }
}

@Scene(DO.VIEW_VIDEOS)
export class ViewVideosScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(
    @Ctx() ctx: SceneContext<Context> & { session: { bodyPartId: number } },
  ) {
    const videos = await this.prisma.video.findMany({
      where: { bodyPartId: ctx.session.bodyPartId },
    });
    if (videos.length === 0) {
      await ctx.reply('Извините, видео для этой части тела не найдены.');
    } else {
      const videoLinks = videos.map((video) => video.link).join('\n');
      await ctx.reply('Видео для выбранной части тела:\n' + videoLinks);
    }
    ctx.scene.leave();
  }
}
