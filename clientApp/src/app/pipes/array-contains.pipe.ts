import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayContains'
})
export class ArrayContainsPipe implements PipeTransform {

  transform(array: any[] | null, value: any, accessor: string): boolean {
    return !!array?.some(item => item[accessor] === value[accessor]);
  }

}
