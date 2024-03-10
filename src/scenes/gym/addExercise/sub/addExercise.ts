import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { GYM_ADD_EXERCISE_STEPS } from 'src/config/steps';
import { GymSceneContext } from 'src/config/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { SceneContext } from 'telegraf/typings/scenes';

@Scene(GYM_ADD_EXERCISE_STEPS.ADD_EXERCISE)
export class AddExerciseScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext) {
    ctx.reply('Введите название упражнения');
  }

  @On('text')
  async onText(@Ctx() ctx: GymSceneContext) {
    const maxOrderStage = await this.prisma.exercise.findMany({
      where: { stageId: ctx.session.stageId },
      orderBy: { order: 'desc' },
      take: 1,
    });
    const maxOrder = maxOrderStage.length > 0 ? maxOrderStage[0].order : 0;

    if (ctx.text)
      this.prisma.exercise
        .create({
          data: {
            name: ctx.text,
            stageId: ctx.session.stageId,
            order: maxOrder + 1,
          },
        })
        .then(async () => {
          ctx.reply('Упражнение добавлено');
          ctx.scene.leave();
        })
        .catch((error) => {
          console.log(error);
          ctx.reply('Произошла ошибка');
        });
  }
}
