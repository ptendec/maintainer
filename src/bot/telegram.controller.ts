import { Ctx, Hears, Update } from 'nestjs-telegraf';
import { ACTIONS, EXERCISES } from 'src/config/steps';
import { PrismaService } from 'src/prisma/prisma.service';
import { Context, Markup } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';

export interface Session {
  exerciseTypeId: number;
  bodyPartId: number;
}

@Update()
export class ExerciseUpdate {
  constructor(private readonly prisma: PrismaService) {}
  @Hears('Показать ссылки')
  async showLinks(@Ctx() ctx: Context) {
    const videos = await this.prisma.video.findMany();
    ctx.reply(videos.map((video) => video.link).join('\n'));
  }

  @Hears(ACTIONS.EXERCISES)
  async start(@Ctx() ctx: Context) {
    await ctx.reply(
      'Выберите',
      Markup.keyboard([EXERCISES.ADD, EXERCISES.DO]).resize(),
    );
  }

  @Hears(EXERCISES.ADD)
  async addbodyPartsceneEnter(@Ctx() ctx: SceneContext<Context>) {
    ctx.scene.enter(EXERCISES.ADD);
  }

  @Hears(EXERCISES.DO)
  async startExercise(@Ctx() ctx: SceneContext<Context>) {
    ctx.scene.enter(EXERCISES.DO);
  }
}