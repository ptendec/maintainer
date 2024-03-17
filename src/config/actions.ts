interface Action {
  name: string;
  id: string;
}

export const ACTIONS: Action[] = [
  {
    name: 'Добавить',
    id: 'ADD',
  },
  {
    name: 'Заняться',
    id: 'DO',
  },
];

export const DO: Action[] = [
  {
    name: 'Физическая активность',
    id: 'DO.EXERCISES',
  },
  {
    name: 'Тренироваться',
    id: 'DO.GYM',
  },
];

export const ADD: Action[] = [
  {
    name: 'Упражнения',
    id: 'ADD.EXERCISES',
  },
  {
    name: 'Тренировка',
    id: 'ADD.GYM',
  },
];
