export interface MeetType {
  id?: string;
  name: string;
  description?: string;
}

export const meetTypes = [
  'Accompagnateur',
  'Ménage',
  'Personne à tout faire',
  'Préposé',
  'Sport',
  'Transport',
];

export const getMeetTypeClass = (meetType: string): string => {
  if (meetType === 'Accompagnateur') return 'companion';
  if (meetType === 'Ménage') return 'cleaning';
  if (meetType === 'Personne à tout faire') return 'repair';
  if (meetType === 'Préposé') return 'attendant';
  if (meetType === 'Sport') return 'sport';
  if (meetType === 'Transport') return 'transport';
  return '';
};
