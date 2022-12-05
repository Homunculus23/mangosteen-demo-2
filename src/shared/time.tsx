/* 
  example
  import { Time } from 'shared/time';
  const time = new Time();
  time.format('YYYY-MM-DD');
  time.firstDayOfMonth();
  time.firstDayOfYear();
  time.lastDayOfMonth();
  time.lastDayOfYear();
  time.add(1, 'month');
*/
export class Time {
  date: Date;
  constructor(date?: string | Date) {
    if (date === undefined) {
      this.date = new Date();
    } else if (typeof date === "string") {
      this.date = new Date(date);
    } else {
      this.date = date;
    }
  }
  format(pattern = "YYYY-MM-DD") {
    // 目前支持的格式有 YYYY MM DD HH mm ss SSS
    const year = this.date.getFullYear();
    const month = this.date.getMonth() + 1;
    const day = this.date.getDate();
    const hour = this.date.getHours();
    const minute = this.date.getMinutes();
    const second = this.date.getSeconds();
    const msecond = this.date.getMilliseconds();
    return pattern
      .replace(/YYYY/g, year.toString())
      .replace(/MM/, month.toString().padStart(2, "0"))
      .replace(/DD/, day.toString().padStart(2, "0"))
      .replace(/HH/, hour.toString().padStart(2, "0"))
      .replace(/mm/, minute.toString().padStart(2, "0"))
      .replace(/ss/, second.toString().padStart(2, "0"))
      .replace(/SSS/, msecond.toString().padStart(3, "0"));
  }
  //当月的第一天
  firstDayOfMonth() {
    //new Date(年,月,日,时,分,秒)
    return new Time(new Date(this.date.getFullYear(), this.date.getMonth(), 1, 0, 0, 0));
  }
  //当年的第一天
  firstDayOfYear() {
    return new Time(new Date(this.date.getFullYear(), 1, 1, 0, 0, 0));
  }
  //当月的最后一天
  lastDayOfMonth() {
    //下个月的0号，也就是当月的最后一天
    return new Time(new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0, 0, 0, 0));
  }
  //今年的最后一天
  lastDayOfYear() {
    return new Time(new Date(this.date.getFullYear() + 1, 1, 0, 0, 0, 0));
  }
  getRaw() {
    return this.date;
  }
  //当天时间戳
  getTimestamp() {
    return this.date.getTime();
  }
  //减法用负数加法解决
  add(amount: number, unit: "year" | "month" | "day" | "hour" | "minute" | "second" | "millisecond") {
    // return new Time but not change this.date
    let date = new Date(this.date.getTime());
    switch (unit) {
      case "year":
        const currentDate = date.getDate();
        date.setDate(1);
        date.setFullYear(date.getFullYear() + amount);
        const targetDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 0, 0, 0).getDate();
        date.setDate(Math.min(currentDate, targetDate));
        break;
      //尽量符合大众对自然月的认知
      case "month":
        //假设date为1月31日, amount为1，该case的注释均基于该假设
        const d = date.getDate(); //d = 31
        date.setDate(1); //将date 日期改为1日
        date.setMonth(date.getMonth() + amount); //将 date 月份改为2月
        const d2 = new Date(date.getFullYear(), date.getMonth() + 1, 0, 0, 0, 0).getDate(); //基于2月1日，创建一个3月0日的新Date，也就是2月29日，d2 = 29
        date.setDate(Math.min(d, d2)); //将 date 日期设定为 d/d2 中较小的值，这里就改为了 2月29日
        break;
      case "day":
        date.setDate(date.getDate() + amount);
        break;
      case "hour":
        date.setHours(date.getHours() + amount);
        break;
      case "minute":
        date.setMinutes(date.getMinutes() + amount);
        break;
      case "second":
        date.setSeconds(date.getSeconds() + amount);
        break;
      case "millisecond":
        date.setMilliseconds(date.getMilliseconds() + amount);
        break;
      default:
        throw new Error("Time.add: unknown unit");
    }
    return new Time(date);
  }
}

// export const time = (date = new Date()) => {
//   const api = {
//     //获取当前月的第一天
//     firstDayOfMonth: () =>{
//       //每次使用time都会产生一个新的API对象，为了节省性能，全都做到原型上。
//       return time(new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0))
//     },
//   }
//   return api
// }
