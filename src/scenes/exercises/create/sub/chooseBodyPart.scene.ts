import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { ADD } from 'src/config/steps';
import { ExercisesSceneContext } from 'src/config/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { Markup } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';

@Scene(ADD.CHOOSE_BODY_PART)
export class AddChooseBodyPartScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext) {
    const bodyParts = await this.prisma.bodyPart.findMany();
    const keyboardOptions = bodyParts.map((part) => [
      Markup.button.callback(part.name, `choose_${part.id}`),
    ]);
    keyboardOptions.push([Markup.button.callback(ADD.ADD_BODY_PART, 'add')]);
    await ctx.reply(
      'Выберите категорию:',
      Markup.inlineKeyboard(keyboardOptions),
    );
  }

  @Action('add')
  async add(@Ctx() ctx: SceneContext) {
    ctx.scene.enter(ADD.ADD_BODY_PART);
  }

  @Action(/choose_(.+)/)
  async choose(@Ctx() ctx: ExercisesSceneContext) {
    // @ts-expect-error match
    const bodyPartId = ctx.match[1];
    ctx.session.bodyPartId = parseInt(bodyPartId);
    ctx.scene.enter(ADD.ADD_VIDEO);
  }
}
