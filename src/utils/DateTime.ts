import {add0ToNumber} from './add0ToNumber';

export class DateTime {
  static getTime = (num: Date) => {
    const date = new Date(num);

    return `${add0ToNumber(date.getHours())}:${add0ToNumber(
      date.getMinutes(),
    )}`;
  };
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

  static timestampToVietnamDate = (timestamp: number): string => {
    // Tạo đối tượng Date
    const date = new Date(timestamp);

    // Điều chỉnh múi giờ thành UTC+7 (Việt Nam)
    date.setHours(date.getHours() + 7);

    // Định dạng ngày tháng năm
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const day = String(date.getDate()).padStart(2, '0');

    return `${day}/${month}/${year}`;
  };

  static convertToTimestamp = (isoString: string): number => {
    const date = new Date(isoString);
    return date.getTime();
  };
}
