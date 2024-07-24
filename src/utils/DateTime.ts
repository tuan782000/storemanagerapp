import {add0ToNumber} from './add0ToNumber';

export class DateTime {
  static dateToDateString = (val: Date) => {
    if (val) {
      const d = new Date(val);

      return `${add0ToNumber(d.getDate())}/${add0ToNumber(
        d.getMonth() + 1,
      )}/${d.getFullYear()}`;
    } else {
      return '';
    }
  };
  static CalendarDate = (val: Date) => {
    const date = new Date(val);

    return `${date.getFullYear()}-${add0ToNumber(
      date.getMonth() + 1,
    )}-${add0ToNumber(date.getDate())}`;
  };
  static CalendarDateTime = (val: Date) => {
    const date = new Date(val);

    return `${date.getFullYear()}-${add0ToNumber(
      date.getMonth() + 1,
    )}-${add0ToNumber(date.getDate())} ${add0ToNumber(
      date.getHours(),
    )}:${add0ToNumber(date.getMinutes())}:${add0ToNumber(date.getSeconds())}`;
  };

  static GetDateTimeString = (num: number) => {
    const date = new Date(num);

    return `${add0ToNumber(date.getHours())}:${add0ToNumber(
      date.getMinutes(),
    )} ${this.dateToDateString(date)}`;
  };
}
