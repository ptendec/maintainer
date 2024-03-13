import { Ctx, Hears, On, Scene, SceneEnter, SceneLeave } from 'nestjs-telegraf';
import { PrismaService } from 'src/prisma/prisma.service';
import { Scenes } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';

@Scene('addExercise')
export class AddExerciseScene {
  private steps = [
    {
      key: 'name',
      message: 'Введите название упражнения или отправьте /skip для пропуска.',
    },
    {
      key: 'sets',
      message: 'Введите количество подходов или отправьте /skip для пропуска.',
    },
    {
      key: 'repeats',
      message:
        'Введите количество повторений или отправьте /skip для пропуска.',
    },
    {
      key: 'remark',
      message:
        'Введите примечание упражнения или отправьте /skip для пропуска.',
    },
    {
      key: 'warning',
      message:
        'Введите предупреждение упражнения или отправьте /skip для пропуска.',
    },
    {
      key: 'video',
      message: 'Прикрепите видео упражнения или отправьте /skip для пропуска.',
    },
  ];
  private currentStepIndex = 0;

  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext) {
    await ctx.reply(this.steps[this.currentStepIndex].message);
  }

  @On('text')
  async onText(@Ctx() ctx: SceneContext & { session: any }) {
    // const text = ctx.message.text;
    // if (!text) return;
    // if (text === '/skip') {
    //   await this.skipStep(ctx);
    //   return;
    // }
    // ctx.session[this.steps[this.currentStepIndex].key] =
    //   this.steps[this.currentStepIndex].key === 'sets' ||
    //   this.steps[this.currentStepIndex].key === 'repeats'
    //     ? parseInt(text)
    //     : text;
    // this.moveToNextStep(ctx);
  }

  async moveToNextStep(ctx: Scenes.SceneContext) {
    this.currentStepIndex++;
    if (this.currentStepIndex < this.steps.length) {
      await ctx.reply(this.steps[this.currentStepIndex].message);
    } else {
      await this.completeScene(ctx);
    }
  }

  @Hears('/skip')
  async skipStep(@Ctx() ctx: Scenes.SceneContext) {
    await ctx.reply('Шаг пропущен.');
    this.moveToNextStep(ctx);
  }

  async completeScene(@Ctx() ctx: Scenes.SceneContext) {
    await ctx.reply('Упражнение добавлено!');
    ctx.scene.leave();
  }

  @SceneLeave()
  leave(@Ctx() ctx: Scenes.SceneContext) {
    this.currentStepIndex = 0;
    ctx.session = {};
  }
}
