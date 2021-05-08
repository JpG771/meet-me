import { Pipe, PipeTransform } from '@angular/core';
import { regions } from '../models/region';

@Pipe({
  name: 'region'
})
export class RegionPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string | undefined {
    return regions.find(region => region.code === value)?.name;
  }

}
