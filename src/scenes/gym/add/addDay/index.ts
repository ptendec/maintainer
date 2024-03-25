import { Ctx, Wizard, WizardStep } from 'nestjs-telegraf';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { GYM_ADD_STEPS } from 'src/config/steps';
import { WizardContext } from 'telegraf/typings/scenes';

@Wizard(GYM_ADD_STEPS.ADD_DAY)
export class AddDayScene {
  constructor(private readonly prisma: PrismaService) {}

  @WizardStep(1)
  async chooseProgramForDay(@Ctx() ctx: WizardContext) {
    const results = await this.prisma.program.findMany();
    ctx.reply('Выберите программу', {
      reply_markup: {
        inline_keyboard: results.map((result) => [
          {
            text: result.name,
            callback_data: `choose_program:${result.id}`,
          },
        ]),
      },
    });
    ctx.wizard.next();
  }

  @WizardStep(2)
  async onProgramChosen(
    @Ctx()
    ctx: WizardContext & { update: { callback_query: { data: string } } },
  ) {
    const data = ctx.update.callback_query.data;
    const match = data.match(/choose_program:(\d+)/);
    if (match) {
      // @ts-expect-error programId
      ctx.wizard.state.programId = Number(match[1]);
      ctx.reply('Введите название дня');
      ctx.wizard.next();
    } else {
      ctx.reply('Произошла ошибка, попробуйте снова.');
    }
  }

  @WizardStep(3)
  async addDay(@Ctx() ctx: WizardContext & { message: { text: string } }) {
    const dayName = ctx.message.text;
    // @ts-expect-error programId
    const programId = ctx.wizard.state.programId;

    if (dayName && programId) {
      this.prisma.day
        .create({
          data: {
            name: dayName,
            programId,
          },
        })
        .then(() => {
          ctx.reply('День добавлен.');
          ctx.scene.leave();
        })
        .catch((error) => {
          console.error(error);
          ctx.reply('Произошла ошибка при добавлении дня.');
        });
    } else {
      ctx.reply('Произошла ошибка, пожалуйста, начните заново.');
      ctx.scene.leave();
    }
  }
}
