import { Action, Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { Session } from 'src/bot/telegram.controller';
import { ADD, EXERCISES } from 'src/config/steps';
import { PrismaService } from 'src/prisma/prisma.service';
import { Context, Markup } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';

@Scene(EXERCISES.ADD)
export class AddExerciseScene {
  @SceneEnter()
  async onEnter(@Ctx() ctx: SceneContext<Context>) {
    ctx.scene.enter(ADD.CHOOSE_EXERCISE_TYPE);
  }
}

@Scene(ADD.CHOOSE_EXERCISE_TYPE)
export class ChooseExerciseTypeScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext<Context>) {
    const bodyParts = await this.prisma.exerciseType.findMany();
    const keyboardOptions = bodyParts.map((type) => [
      Markup.button.callback(type.name, `choose_${type.id}`),
    ]);
    keyboardOptions.push([
      Markup.button.callback(ADD.ADD_EXERCISE_TYPE, 'add'),
    ]);
    await ctx.reply(
      'Выберите категорию:',
      Markup.inlineKeyboard(keyboardOptions),
    );
  }

  @Action(/choose_(.+)/)
  async choose(@Ctx() ctx: SceneContext<Context> & { session: Session }) {
    // @ts-expect-error match
    const typeId = ctx.match[1];
    ctx.session.exerciseTypeId = parseInt(typeId);
    ctx.scene.enter(ADD.CHOOSE_BODY_PART);
  }

  @Action('add')
  async add(@Ctx() ctx: SceneContext<Context>) {
    ctx.scene.enter(ADD.ADD_EXERCISE_TYPE);
  }
}

@Scene(ADD.ADD_EXERCISE_TYPE)
export class CreatebodyPartscene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext<Context>) {
    ctx.reply('Напишите название нового вида');
  }

  @On('text')
  async onText(@Ctx() ctx: SceneContext<Context> & { session: Session }) {
    if (ctx.text)
      await this.prisma.exerciseType
        .create({
          data: {
            name: ctx.text,
          },
        })
        .then(async (created) => {
          ctx.session.exerciseTypeId = created.id;
          ctx.scene.enter(ADD.CHOOSE_BODY_PART);
        });
  }
}

@Scene(ADD.CHOOSE_BODY_PART)
export class AddChooseBodyPartScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext<Context>) {
    const bodyParts = await this.prisma.bodyPart.findMany();
    const keyboardOptions = bodyParts.map((part) => [
      Markup.button.callback(part.name, `choose_${part.id}`),
    ]);
    keyboardOptions.push([Markup.button.callback(ADD.ADD_BODY_PART, 'add')]);
    await ctx.reply(
      'Выберите категорию:',
      Markup.inlineKeyboard(keyboardOptions),
    );
  }

  @Action('add')
  async add(@Ctx() ctx: SceneContext<Context>) {
    ctx.scene.enter(ADD.ADD_BODY_PART);
  }

  @Action(/choose_(.+)/)
  async choose(@Ctx() ctx: SceneContext<Context> & { session: Session }) {
    // @ts-expect-error match
    const bodyPartId = ctx.match[1];
    ctx.session.bodyPartId = parseInt(bodyPartId);
    ctx.scene.enter(ADD.ADD_VIDEO);
  }
}

@Scene(ADD.ADD_BODY_PART)
export class AddBodyPartScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext<Context>) {
    ctx.reply('Напиши название новой части тела');
  }

  @On('text')
  async onText(@Ctx() ctx: SceneContext<Context> & { session: Session }) {
    console.log(ctx.session);
    if (ctx.text)
      await this.prisma.bodyPart
        .create({
          data: {
            name: ctx.text,
            exerciseType: {
              connect: {
                id: ctx.session.exerciseTypeId,
              },
            },
          },
        })
        .then(async (created) => {
          ctx.session.bodyPartId = created.id;
          ctx.scene.enter(ADD.ADD_VIDEO);
        });
  }
}

@Scene(ADD.ADD_VIDEO)
export class AddVideoScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext<Context>) {
    ctx.reply('Отправьте ссылку на видео');
  }

  @On('text')
  async onText(@Ctx() ctx: SceneContext<Context> & { session: Session }) {
    if (ctx.text)
      await this.prisma.video
        .create({
          data: {
            link: ctx.text,
            bodyPart: {
              connect: {
                id: ctx.session.bodyPartId,
              },
            },
          },
        })
        .then(async (created) => {
          ctx.session.bodyPartId = created.id;
          ctx.scene.leave();
        });
  }
}
