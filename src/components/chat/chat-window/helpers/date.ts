import { type ItemMessage } from '../../../../api/api-quick-blox';

export const getCorrectlyTime = (date: string) => {
  const time = new Date(date);
  return `${time.getHours()}:${time.getMinutes()}`;
};

export const getCorrectlyDay = (elem: ItemMessage[] | undefined) => {
  const lastElem = elem?.pop();

  const date = new Date(lastElem?.created_at!);

  return date.toLocaleString('en-us', { weekday: 'long', month: 'long', day: 'numeric' });
};
