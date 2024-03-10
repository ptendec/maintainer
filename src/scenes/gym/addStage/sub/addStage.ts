import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { GYM_ADD_STAGE_STEPS } from 'src/config/steps';
import { GymSceneContext } from 'src/config/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { SceneContext } from 'telegraf/typings/scenes';

@Scene(GYM_ADD_STAGE_STEPS.ADD_STAGE)
export class AddStageScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext) {
    ctx.reply('Введите название этапа');
  }

  @On('text')
  async onText(@Ctx() ctx: GymSceneContext) {
    const maxOrderStage = await this.prisma.stage.findMany({
      where: { dayId: ctx.session.dayId },
      orderBy: { order: 'desc' },
      take: 1,
    });
    const maxOrder = maxOrderStage.length > 0 ? maxOrderStage[0].order : 0;

    if (ctx.text)
      this.prisma.stage
        .create({
          data: {
            name: ctx.text,
            dayId: ctx.session.dayId,
            order: maxOrder + 1,
          },
        })
        .then(async () => {
          ctx.reply('Добавлено');
          ctx.scene.leave();
        })
        .catch((error) => {
          console.log(error);
          ctx.reply('Произошла ошибка');
        });
  }
}
