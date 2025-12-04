export const duration2str = (minutes: number) => `${Math.floor(minutes / 60)} год ${minutes % 60} хв`


export const str2duration = (str: string) => {
  const match = str.match(/^(\d*)\s*год\s*(\d*)\s*хв$/);

  if (!match) return null;

  let hours = parseInt(match[1].slice(0, 1));
  let minutes = parseInt(match[2].slice(0, 2));

  if (Number.isNaN(minutes))
    minutes = 0
  if (Number.isNaN(hours))
    hours = 0
  if (minutes > 59)
    minutes = 59
  if(hours > 9)
    hours = 9
  return hours * 60 + minutes;
}