import { Responder } from './responder';

export interface Meet {
  id?: string;
  title: string;
  offerType: number;
  type: string;
  user: string;
  dateStart: string;
  dateEnd: string;
  region: number;
  description?: string;

  responders?: Responder[];
}