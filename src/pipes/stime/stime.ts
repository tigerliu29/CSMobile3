import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the StimePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'stime',
})
export class StimePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: Date, ...args) {
    let today = new Date();
    if (today.getFullYear() == value.getFullYear()) {
      if (today.getMonth() == value.getMonth() && today.getDate() == value.getDate()) {
        let minute = "0" + value.getMinutes();
        if (minute.length > 2) {
          minute = minute.substr(minute.length - 2, 2);
        }
        return value.getHours() + ":" + minute;
      }
      else {
        return (value.getMonth() + 1) + "月" + value.getDate() + "日";
      }
    }
    else {
      return value.getFullYear() + "年" + (value.getMonth() + 1) + "月" + value.getDate() + "日";
    }
  }
}
