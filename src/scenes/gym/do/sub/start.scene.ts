import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { GYM_DO_STEPS } from 'src/config/steps';
import { GymSceneContext } from 'src/config/types';
import { Markup } from 'telegraf';

@Scene(GYM_DO_STEPS.START)
export class GymStartScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: GymSceneContext) {
    const stages = await this.prisma.stage.findMany({
      orderBy: {
        order: 'asc',
      },
      where: {
        dayId: ctx.session.dayId,
      },
    });
    const stageExercises = await this.prisma.exercise.findMany({
      where: {
        stageId: stages[0].id,
      },
      orderBy: {
        order: 'asc',
      },
    });
    ctx.session.stageId = stages[0].id;
    ctx.session.exerciseId = stageExercises[0].id;
    ctx.session.stages = stages.map((stage) => stage.id);
    ctx.session.exercises = stageExercises.map((exercise) => exercise.id);
    ctx.reply('Первый этап : ' + stages[0].name);
    ctx.reply(
      'Упражнение: ' + stageExercises[0].name,
      Markup.keyboard([['Завершил']]).resize(),
    );
  }

  @Hears('Завершил')
  async end(@Ctx() ctx: GymSceneContext) {
    const currentIndex = ctx.session.exercises.indexOf(ctx.session.exerciseId);
    if (currentIndex < ctx.session.exercises.length - 1) {
      const nextExerciseId = ctx.session.exercises[currentIndex + 1];
      ctx.session.exerciseId = nextExerciseId;
      const nextExercise = await this.prisma.exercise.findUnique({
        where: { id: nextExerciseId },
      });

      let replyMessage = 'Следующее упражнение: ' + nextExercise?.name;

      if (nextExercise?.remark) {
        replyMessage += `\nПримечание: ${nextExercise.remark}`;
      }

      if (nextExercise?.warning) {
        replyMessage += `\nВнимание: ${nextExercise.warning}`;
      }

      if (nextExercise?.sets) {
        replyMessage += `\nПодходы: ${nextExercise.sets}`;
      }

      if (nextExercise?.repeats) {
        replyMessage += `\nПовторения: ${nextExercise.repeats}`;
      }

      ctx.reply(replyMessage);

      if (nextExercise?.video) {
        ctx.replyWithAnimation(nextExercise.video);
      }
    } else {
      const currentStageIndex = ctx.session.stages.indexOf(ctx.session.stageId);
      if (currentStageIndex < ctx.session.stages.length - 1) {
        const nextStageId = ctx.session.stages[currentStageIndex + 1];
        ctx.session.stageId = nextStageId;
        const stageExercises = await this.prisma.exercise.findMany({
          where: { stageId: nextStageId },
          orderBy: { order: 'asc' },
        });
        ctx.session.exercises = stageExercises.map((exercise) => exercise.id);
        ctx.session.exerciseId = stageExercises[0].id;
        ctx.reply('Следующий этап: ' + stageExercises[0].name);
      } else {
        ctx.reply('Тренировка завершена!');
      }
    }
  }
}
