// Date will be local time, no need to save timezone
export const dateToString = (date: Date) => {
  if (date && date.toISOString) {
    date.setUTCHours(date.getHours());
    return date.toISOString().substring(0, 16);
  }
  return null;
}

export const roundHour = (date: Date) => {
  const newDate = new Date(date);
  newDate.setHours(date.getHours() + 1, 0, 0, 0);
  return newDate;
}