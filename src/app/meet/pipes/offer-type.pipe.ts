import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'offerType'
})
export class OfferTypePipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string {
    if (value === 1) {
      return 'Demande';
    } else {
      return 'Offre';
    }
  }

}
