import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { ADD_EXERCISE } from 'src/config/steps';
import { ExercisesSceneContext } from 'src/config/types';
import { SceneContext } from 'telegraf/typings/scenes';

@Scene(ADD_EXERCISE.ADD_VIDEO)
export class AddVideoScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext) {
    ctx.reply('Отправьте ссылку на видео');
  }

  @On('text')
  async onText(@Ctx() ctx: ExercisesSceneContext) {
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
