import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { GYM_ADD_DAY_STEPS } from 'src/config/steps';
import { GymSceneContext } from 'src/config/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { SceneContext } from 'telegraf/typings/scenes';

@Scene(GYM_ADD_DAY_STEPS.ADD_DAY)
export class AddDayScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext) {
    ctx.reply('Введите название дня');
  }

  @On('text')
  async onText(@Ctx() ctx: GymSceneContext) {
    if (ctx.text)
      this.prisma.day
        .create({
          data: {
            name: ctx.text,
            programId: ctx.session.programId,
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
