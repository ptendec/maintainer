import { Ctx, Wizard, WizardStep } from 'nestjs-telegraf';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { GYM_ADD_EXERCISE_STEPS } from 'src/config/steps';
import { MaxOrderService } from 'src/shared/max-order.service';
import { WizardContext } from 'telegraf/typings/scenes';

interface ExerciseState {
  name: string;
  sets: number;
  repeats: number;
  remark: string;
  video: string;
}

@Wizard(GYM_ADD_EXERCISE_STEPS.ADD_EXERCISE)
export class AddExerciseScene {
  constructor(
    private readonly prisma: PrismaService,
    private maxOrderService: MaxOrderService,
  ) {}

  @WizardStep(1)
  async writeName(ctx: WizardContext) {
    ctx.reply('Введите название упражнения');
    ctx.wizard.next();
  }

  @WizardStep(2)
  async onNameChosen(
    @Ctx()
    ctx: WizardContext,
  ) {
    const name = ctx.text;
    if (name) {
      // @ts-expect-error name
      ctx.wizard.state.name = name;
      ctx.reply('Введите количество подходов');
      ctx.wizard.next();
    } else {
      ctx.reply('Произошла ошибка, попробуйте снова.');
    }
  }

  @WizardStep(3)
  async writeSets(@Ctx() ctx: WizardContext) {
    const sets = ctx.text;
    if (sets) {
      // @ts-expect-error sets
      ctx.wizard.state.sets = Number(sets);
      ctx.reply('Введите количество повторений');
      ctx.wizard.next();
    } else {
      ctx.reply('Произошла ошибка, попробуйте снова.');
    }
  }

  @WizardStep(4)
  async writerepeats(@Ctx() ctx: WizardContext) {
    const repeats = ctx.text;
    if (repeats) {
      // @ts-expect-error repeats
      ctx.wizard.state.repeats = Number(repeats);
      ctx.reply('Отправьте видео');
      ctx.wizard.next();
    } else {
      ctx.reply('Произошла ошибка, попробуйте снова.');
    }
  }

  @WizardStep(5)
  async onSentVideo(@Ctx() ctx: WizardContext) {
    // @ts-expect-error animation
    const animation = ctx.update.message.animation;
    // @ts-expect-error video
    ctx.wizard.state.video = animation.file_id;
    ctx.reply('Видео получено');
    ctx.reply('Введите примечание');
    ctx.wizard.next();
    console.log('ctx.wizard.next()', ctx.wizard.next());
  }

  @WizardStep(6)
  async writeRemark(@Ctx() ctx: WizardContext) {
    const remark = ctx.text;
    if (remark) {
      // @ts-expect-error remark
      ctx.wizard.state.remark = remark;
      ctx.wizard.next();
    } else {
      ctx.reply('Произошла ошибка, попробуйте снова.');
    }
  }

  @WizardStep(7)
  async createExerciseForGym(
    @Ctx()
    ctx: WizardContext & {
      session: { stageId: number; dayId: number };
    },
  ) {
    console.log('шаааг');
    const { name, sets, repeats, remark, video } = ctx.wizard
      .state as ExerciseState;

    const maxOrder = await this.maxOrderService.findMaxOrder('exercise', {
      name: 'stageId',
      value: ctx.session.stageId,
    });
    this.prisma.exercise
      .create({
        data: {
          name,
          sets,
          repeats,
          remark,
          video,
          stageId: ctx.session.stageId,
          order: maxOrder + 1,
          // TODO: Add exerciseVideoId
        },
      })
      .then(() => {
        ctx.reply('Упражнение добавлено.');
        ctx.scene.leave();
      })
      .catch((error) => {
        console.error(error);
        ctx.reply('Произошла ошибка при добавлении упражнения.');
        ctx.scene.leave();
      });
  }
}
