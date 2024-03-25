import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { DO_EXERCISE } from 'src/config/steps';
import { SceneContext } from 'telegraf/typings/scenes';

@Scene(DO_EXERCISE.VIEW_VIDEOS)
export class ViewVideosScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(
    @Ctx() ctx: SceneContext & { session: { bodyPartId: number } },
  ) {
    const videos = await this.prisma.video.findMany({
      where: { bodyPartId: ctx.session.bodyPartId },
    });
    if (videos.length === 0) {
      await ctx.reply('Извините, видео для этой части тела не найдены.');
    } else {
      const videoLinks = videos.map((video) => video.link).join('\n');
      await ctx.reply('Видео для выбранной части тела:\n' + videoLinks);
    }
    ctx.scene.leave();
  }
}
