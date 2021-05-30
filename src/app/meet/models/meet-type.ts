import {
  blue700,
  blueA200,
  green700,
  greenA200,
  mint700,
  mintA200,
  pink700,
  pinkA200,
  purple700,
  purpleA100,
  yellow700,
  yellowA200,
} from 'src/app/scss/palette';

export interface MeetType {
  id?: string;
  name: string;
  description?: string;
}

export const meetTypes = [
  'Accompagnateur',
  'Guardien',
  'Ménage',
  'Personne à tout faire',
  'Préposé',
  'Sport',
  'Transport',
];

export const getMeetTypeClass = (meetType: string): string => {
  if (meetType === 'Accompagnateur') return 'companion';
  if (meetType === 'Guardien') return 'guard';
  if (meetType === 'Ménage') return 'cleaning';
  if (meetType === 'Personne à tout faire') return 'repair';
  if (meetType === 'Préposé') return 'attendant';
  if (meetType === 'Sport') return 'sport';
  if (meetType === 'Transport') return 'transport';
  return '';
};

export const getMeetTypeColor = (meetType: string): string => {
  if (meetType === 'Accompagnateur') return blue700;
  if (meetType === 'Ménage') return mint700;
  if (meetType === 'Personne à tout faire') return yellow700;
  if (meetType === 'Préposé') return pink700;
  if (meetType === 'Sport') return green700;
  if (meetType === 'Transport') return purple700;
  return blue700;
};

export const getMeetTypeColorLight = (meetType: string): string => {
  if (meetType === 'Accompagnateur') return blueA200;
  if (meetType === 'Ménage') return mintA200;
  if (meetType === 'Personne à tout faire') return yellowA200;
  if (meetType === 'Préposé') return pinkA200;
  if (meetType === 'Sport') return greenA200;
  if (meetType === 'Transport') return purpleA100;
  return blueA200;
};
