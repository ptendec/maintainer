import { Composer, Ctx, Hears, Start } from 'nestjs-telegraf';
import { ACTIONS } from 'src/config/steps';
import { PrismaService } from 'src/prisma/prisma.service';
import { Context, Markup } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';

interface Dish {
  week: number;
  breakfast: string;
  second_breakfast: string;
  lunch: string;
  afternoon: string;
  dinner: string;
}
const diet: Dish[] = [
  {
    week: 0,
    breakfast: '80 г овсянки, 50 г грецких орехов, 100 г творога, пол банана',
    second_breakfast: '100 г кефира, чайная ложка мёда, все в блендере',
    lunch: '200 г куриного филе, 80 г гречки',
    afternoon: '100 г творога, 20 г сметаны',
    dinner:
      '200 г куриного филе (запеченного в духовке), 80 г гречки, овощной салат',
  },
  {
    week: 1,
    breakfast: '4 целых яйца, 80 г овсянки',
    second_breakfast:
      '15 слайсов (рисовых или гречневых) 100 г сыра, 1 столовая ложка арахисовой пасты',
    lunch:
      '200 г говядины (запеченного в духовке) 80 г гречки, салат на оливковом масле',
    afternoon: '5 яиц, любую клетчатку (зелень) на подсолнечном масле',
    dinner:
      '200 г творога, чайная ложка мёда, банан, все в блендере, 30 г грецких орехов',
  },
  {
    week: 2,
    breakfast: '80 г овсянки, 30 г изюма',
    second_breakfast: '100 г миндаля, 200 г творога',
    lunch: '200 г рыбы, 100 г риса',
    afternoon: '5 яиц, любую клетчатку (зелень) на подсолнечном масле',
    dinner:
      '200 г творога, чайная ложка мёда, банан, все в блендере, 30 г грецких орехов',
  },
  {
    week: 3,
    breakfast: '4 целых яйца, 50 г овсянки, 100 г орехов',
    second_breakfast: 'Яблоко или грейпфрут',
    lunch: '150 г рыбы, 100 г макароны (твёрдый сорт)',
    afternoon: '150 г говядины, 100 г макароны',
    dinner: '5 целых яиц (можно жареных на кокосовом масле), овощной салат',
  },
  {
    week: 4,
    breakfast: 'Омлет из 4х яиц + 4 дольки горького шоколада',
    second_breakfast: '100 г миндаля',
    lunch:
      '200 г куриной грудки (запеченной в духовке), 90г. гречки, любая клетчатка',
    afternoon:
      '250 мл йогурта (подойдет любой кисломолочный) натуральный, 3 киви',
    dinner: '200 г куриной грудки, овощной салат',
  },
  {
    week: 5,
    breakfast: '90 г овсянки, ложка чайная меда',
    second_breakfast:
      '250 г фруктового салата (любые фрукты которые любишь) заправленного йогуртом (активия натуральная), 100 г миндаля',
    lunch: '150 г куриной грудки, 200 г запеченного картофеля',
    afternoon: '5 яиц, овощной салат на 1-ой столовой ложке оливкового масла',
    dinner: '150 г, грудки куриной, овощной теплый салат, 90 г. риса',
  },
  {
    week: 6,
    breakfast: '100 г овсянки каши на воде, 30 г. орехов, 50 г изюма',
    second_breakfast: '60гр творога, яблоко, 4 дольки горького шоколада',
    lunch: '200 г грудки, 90 г риса',
    afternoon: '200 г творога, 20 г. сметаны нежирной 15%',
    dinner: '150 г грудки куриной, овощной теплый салат, 90 г. риса',
  },
];

function getMenuTime(menu: string): string {
  let mealtime;
  switch (menu) {
    case 'breakfast':
      mealtime = '10:00';
      break;
    case 'second_breakfast':
      mealtime = '12:00';
      break;
    case 'lunch':
      mealtime = '14:00';
      break;
    case 'afternoon':
      mealtime = '16:00';
      break;
    case 'dinner':
      mealtime = '19:00';
      break;
    default:
      mealtime = 'Неизвестное время';
  }
  return mealtime;
}

@Composer()
export class ComposerCommon {
  constructor(private readonly prisma: PrismaService) {}

  @Start()
  async start(@Ctx() ctx: SceneContext<Context>) {
    ctx.scene.leave();
    await ctx.reply(
      'Салам епта!!!',
      Markup.keyboard([ACTIONS.EXERCISES]).resize(),
    );
  }

  @Hears('Добавить')
  async add(@Ctx() ctx: SceneContext<Context>) {
    try {
      const createdDiet = await this.prisma.diet.create({
        data: {
          name: 'Первое',
        },
      });
      for (let i = 0; i < diet.length; i++) {
        const day = Object.entries(diet[i]);
        for (let l = 1; l < day.length; l++) {
          console.log(day[l]);
          const createdDish = await this.prisma.dish.create({
            data: {
              dietId: createdDiet.id,
              name: day[l][1] as string,
            },
          });
          await this.prisma.schedule.create({
            data: {
              week: day[0][1] as number,
              datetime: getMenuTime(day[l][0]),
              dishId: createdDish.id,
            },
          });
        }
      }
      ctx.reply('Создано успешно');
    } catch (error) {
      console.log(error);
      ctx.reply('Не удалось создать');
    }
  }

  @Hears('Показать')
  async showDiet(@Ctx() ctx: SceneContext<Context>) {
    try {
      const diets = await this.prisma.diet.findMany({
        include: {
          dishes: {
            include: {
              schedule: true,
            },
          },
        },
      });
      for (const diet of diets) {
        let response = `Diet ID: ${diet.id}\nName: ${diet.name}\n`;

        for (const dish of diet.dishes) {
          response += `  Dish ID: ${dish.id}\n`;
          response += `    Name: ${dish.name}\n`;
          response += `    Recipe: ${dish.recipe}\n`;
          response += `    Proteins: ${dish.proteins}\n`;
          response += `    Carbohydrates: ${dish.carbohydrates}\n`;
          response += `    Fats: ${dish.fats}\n`;
          response += `    Calories: ${dish.calories}\n`;
          response += `    Schedule:\n`;

          if (dish.schedule) {
            response += `      Week: ${dish.schedule.week}\n`;
            response += `      DateTime: ${dish.schedule.datetime}\n`;
          } else {
            response += `      No schedule available\n`;
          }
          await ctx.reply(response);
          response = '';
        }
      }
    } catch (error) {
      console.error('Error retrieving diet information:', error);
      await ctx.reply('An error occurred while retrieving diet information.');
    }
  }
}
