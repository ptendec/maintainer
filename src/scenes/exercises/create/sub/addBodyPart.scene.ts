import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { ADD_EXERCISE } from 'src/config/steps';
import { ExercisesSceneContext } from 'src/config/types';
import { SceneContext } from 'telegraf/typings/scenes';

@Scene(ADD_EXERCISE.ADD_BODY_PART)
export class AddBodyPartScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext) {
    ctx.reply('Напиши название новой части тела');
  }

  @On('text')
  async onText(@Ctx() ctx: ExercisesSceneContext) {
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
          ctx.scene.enter(ADD_EXERCISE.ADD_VIDEO);
        });
  }
}
