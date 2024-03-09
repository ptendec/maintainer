import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { ADD } from 'src/config/steps';
import { ExercisesSceneContext } from 'src/config/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { SceneContext } from 'telegraf/typings/scenes';

@Scene(ADD.ADD_EXERCISE_TYPE)
export class CreatebodyPartscene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext) {
    ctx.reply('Напишите название нового вида');
  }

  @On('text')
  async onText(@Ctx() ctx: ExercisesSceneContext) {
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
