import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bengaliNumber'
})
export class BengaliNumberPipe implements PipeTransform {
  private bengaliNumbers: { [key: string]: string } = {
    '0': '০',
    '1': '১',
    '2': '২',
    '3': '৩',
    '4': '৪',
    '5': '৫',
    '6': '৬',
    '7': '৭',
    '8': '৮',
    '9': '৯'
  };

  transform(value: number | string): string {
    if (value === null || value === undefined) {
      return '';
    }

    const stringValue = value.toString();
    let result = '';

    for (let i = 0; i < stringValue.length; i++) {
      const char = stringValue[i];
      result += this.bengaliNumbers[char] || char;
    }

    return result;
  }
}


