import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { GYM_ADD_STEPS } from 'src/config/steps';
import { SceneContext } from 'telegraf/typings/scenes';

@Scene(GYM_ADD_STEPS.ADD_PROGRAM)
export class AddProgramScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext) {
    ctx.reply('Введите название программы');
  }

  @On('text')
  async onText(@Ctx() ctx: SceneContext) {
    if (ctx.text)
      this.prisma.program
        .create({
          data: {
            name: ctx.text,
          },
        })
        .then(async () => {
          ctx.reply('Программа добавлена');
          ctx.scene.leave();
        })
        .catch((error) => {
          console.log(error);
          ctx.reply('Произошла ошибка');
        });
  }
}
