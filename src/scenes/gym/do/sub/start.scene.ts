import { Exercise, ExerciseVideo } from '@prisma/client';
import * as fs from 'fs';
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
      include: {
        exerciseVideo: true,
      },
    });
    ctx.session.stageId = stages[0].id;
    ctx.session.exerciseId = stageExercises[0].id;
    ctx.session.stages = stages.map((stage) => stage.id);
    ctx.session.exercises = stageExercises.map((exercise) => exercise.id);
    ctx.reply('Первый этап : ' + stages[0].name);
    ctx.reply(
      'Упражнение: ' + stageExercises[0].name,
      Markup.keyboard([['Следующий']]).resize(),
    );
  }

  private async sendExerciseDetails(
    ctx: GymSceneContext,
    exercise: Exercise & { exerciseVideo: ExerciseVideo[] },
  ) {
    let replyMessage = 'Упражнение: ' + exercise.name;
    replyMessage += exercise.remark ? `\nПримечание: ${exercise.remark}` : '';
    replyMessage += exercise.warning ? `\nВнимание: ${exercise.warning}` : '';
    replyMessage += exercise.sets ? `\nПодходы: ${exercise.sets}` : '';
    replyMessage += exercise.repeats ? `\nПовторения: ${exercise.repeats}` : '';

    ctx.reply(replyMessage, Markup.keyboard([['Следующий']]).resize());
    for (const video of exercise.exerciseVideo) {
      const filePath = process.env.IP + '/public/' + video.name;
      console.log(filePath);

      if (fs.existsSync(filePath)) {
        // Проверка существования файла
        ctx.replyWithVideo(filePath);
      } else {
        console.log('File not found:', filePath);
        // Вывести сообщение о том, что файл не найден или просто продолжить без отправки
      }
    }
  }

  @Hears('Следующий')
  async end(@Ctx() ctx: GymSceneContext) {
    const currentIndex = ctx.session.exercises.indexOf(ctx.session.exerciseId);
    if (currentIndex < ctx.session.exercises.length - 1) {
      const nextExerciseId = ctx.session.exercises[currentIndex + 1];
      ctx.session.exerciseId = nextExerciseId;
      const nextExercise = await this.prisma.exercise.findUnique({
        where: { id: nextExerciseId },
        include: { exerciseVideo: true },
      });
      if (nextExercise) {
        ctx.session.exercises[currentIndex + 1] = nextExercise.id;
        this.sendExerciseDetails(ctx, nextExercise);
      } else {
        ctx.reply(
          'Тренировка завершена!',
          Markup.inlineKeyboard([Markup.button.callback('Закончить', 'start')]),
        );
      }
    } else {
      const currentStageIndex = ctx.session.stages.indexOf(ctx.session.stageId);
      if (currentStageIndex < ctx.session.stages.length - 1) {
        const nextStageId = ctx.session.stages[currentStageIndex + 1];
        ctx.session.stageId = nextStageId;
        const stageExercises = await this.prisma.exercise.findMany({
          where: { stageId: nextStageId },
          orderBy: { order: 'asc' },
          include: { exerciseVideo: true },
        });
        ctx.session.exercises = stageExercises.map((exercise) => exercise.id);
        ctx.session.exerciseId = stageExercises[0].id;
        ctx.reply('Следующий этап: ' + stageExercises[0].name);
      } else {
        ctx.scene.leave();
        ctx.reply(
          'Тренировка завершена!',
          Markup.keyboard([['/start']]).resize(),
        );
      }
    }
  }
}
