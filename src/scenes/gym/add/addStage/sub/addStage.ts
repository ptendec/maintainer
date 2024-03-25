import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { GYM_ADD_STAGE_STEPS } from 'src/config/steps';
import { GymSceneContext } from 'src/config/types';
import { MaxOrderService } from 'src/shared/max-order.service';
import { SceneContext } from 'telegraf/typings/scenes';

@Scene(GYM_ADD_STAGE_STEPS.ADD_STAGE)
export class AddStageScene {
  constructor(
    private readonly prisma: PrismaService,
    private maxOrderService: MaxOrderService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext) {
    ctx.reply('Введите название этапа');
  }

  @On('text')
  async onText(@Ctx() ctx: GymSceneContext) {
    const maxOrder = await this.maxOrderService.findMaxOrder('stage', {
      name: 'dayId',
      value: ctx.session.dayId,
    });

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
