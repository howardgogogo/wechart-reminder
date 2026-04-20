import { Injectable } from '@nestjs/common';

interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeap: boolean;
}

interface SolarDate {
  year: number;
  month: number;
  day: number;
}

@Injectable()
export class LunarService {
  private readonly LUNAR_INFO: number[] = [
    0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
    0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
    0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
    0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
    0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
    0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
    0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096d5, 0x092e0,
    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
    0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
    0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
    0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,
    0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,
    0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,
    0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,
    0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,
    0x0d520,
  ];

  private readonly MONTH_NAMES = [
    '正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊',
  ];

  private readonly DAY_NAMES = [
    '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十',
  ];

  getLunarDate(solarDate: Date): LunarDate {
    const { year, month, day } = this.toSolarStruct(solarDate);
    const offset = this.getDaysBetween(this.baseDate(), solarDate);
    let lunarYear = year;
    let lunarMonth = 1;
    let lunarDay = 1;
    let isLeap = false;

    if (offset < 0) {
      return { year: lunarYear, month: lunarMonth, day: lunarDay, isLeap };
    }

    let accDays = 0;
    const info = this.getLunarYearInfo(year);
    const leapMonth = info & 0xf;
    const leapDays = (info >> 15) & 0x1;
    const yearDays = this.getLunarYearDays(year);

    for (let i = 0; i < 12; i++) {
      const monthDays = this.getLunarMonthDays(year, i + 1);
      if (i + 1 === leapMonth && !isLeap) {
        isLeap = true;
        const leapMonthDays = this.getLunarMonthDays(year, i + 1);
        if (offset < accDays + leapMonthDays) {
          lunarDay = offset - accDays + 1;
          break;
        }
        accDays += leapMonthDays;
      }

      if (isLeap && i + 1 === leapMonth) {
        isLeap = false;
      }

      if (offset < accDays + monthDays) {
        lunarDay = offset - accDays + 1;
        lunarMonth = i + 1;
        break;
      }
      accDays += monthDays;

      if (i + 1 === leapMonth && !isLeap) {
        isLeap = true;
        const leapMonthDays = this.getLunarMonthDays(year, i + 1);
        if (offset < accDays + leapMonthDays) {
          lunarDay = offset - accDays + 1;
          break;
        }
        accDays += leapMonthDays;
        isLeap = false;
      }
    }

    return { year: lunarYear, month: lunarMonth, day: lunarDay, isLeap };
  }

  getNextLunarDate(lunarMonth: number, lunarDay: number, fromDate: Date = new Date()): Date {
    const currentLunar = this.getLunarDate(fromDate);
    let targetYear = fromDate.getFullYear();

    let monthsDiff = (lunarMonth - 1) - currentLunar.month;
    let yearsDiff = 0;

    if (monthsDiff < 0 || (monthsDiff === 0 && lunarDay < currentLunar.day)) {
      monthsDiff += 12;
      yearsDiff = 0;
    }

    for (let y = 0; y <= 1; y++) {
      const testYear = targetYear + yearsDiff + y;
      const info = this.getLunarYearInfo(testYear);
      const leapMonth = info & 0xf;

      for (let m = 0; m < 12; m++) {
        const monthIdx = m + 1;
        let isLeapMonth = monthIdx === leapMonth;
        let days = this.getLunarMonthDays(testYear, monthIdx);

        if (isLeapMonth) {
          days = this.getLunarMonthDays(testYear, monthIdx);
        }

        let monthTotal = monthIdx;
        if (leapMonth > 0 && monthIdx >= leapMonth) {
          monthTotal += 1;
        }

        const diffMonth = (lunarMonth - 1) - monthIdx;
        const diffYear = (testYear - fromDate.getFullYear()) * 12;

        if (diffMonth + diffYear > monthsDiff + yearsDiff * 12) {
          continue;
        }

        for (let d = 1; d <= days; d++) {
          if (monthIdx === lunarMonth && d === lunarDay) {
            const testDate = this.lunarToSolar(testYear, monthIdx, d, isLeapMonth && monthIdx === leapMonth);
            if (testDate && testDate > fromDate) {
              return testDate;
            }
          }
        }
      }
    }

    return new Date(targetYear + 1, lunarMonth - 1, lunarDay);
  }

  lunarToSolar(year: number, month: number, day: number, isLeap: boolean = false): Date | null {
    const totalDays = this.getLunarYearDays(year);
    let offset = 0;

    for (let i = 0; i < month - 1; i++) {
      offset += this.getLunarMonthDays(year, i + 1);
    }

    if (isLeap && month > this.getLunarYearLeapMonth(year)) {
      offset += this.getLunarMonthDays(year, month);
    }

    offset += day - 1;

    const base = this.baseDate();
    const result = new Date(base.getTime() + offset * 24 * 60 * 60 * 1000);

    const lunarCheck = this.getLunarDate(result);
    if (lunarCheck.month !== month || lunarCheck.day !== day || lunarCheck.isLeap !== isLeap) {
      return null;
    }

    return result;
  }

  formatLunarDate(date: LunarDate): string {
    const monthName = this.MONTH_NAMES[date.month - 1] || `${date.month}`;
    const dayName = this.DAY_NAMES[date.day - 1] || `${date.day}`;
    return `${monthName}月${dayName}`;
  }

  private getLunarYearInfo(year: number): number {
    return this.LUNAR_INFO[year - 1900];
  }

  private getLunarYearDays(year: number): number {
    const info = this.getLunarYearInfo(year);
    let days = 0;
    for (let i = 0x8000; i > 0x8; i >>= 1) {
      days += (info & i) ? 30 : 29;
    }
    days += (info >> 15) & 0x1 ? 30 : 0;
    return days;
  }

  private getLunarYearLeapMonth(year: number): number {
    return this.getLunarYearInfo(year) & 0xf;
  }

  private getLunarMonthDays(year: number, month: number): number {
    const info = this.getLunarYearInfo(year);
    const leapMonth = info & 0xf;
    const isLeapMonth = month === leapMonth;
    const monthBit = month > 11 ? 0x100000000 >> 0x20 : 1 << (month - 1);

    if (isLeapMonth && month === leapMonth) {
      return (info >> 15) & 0x1 ? 30 : 29;
    }

    return (info & monthBit) ? 30 : 29;
  }

  private baseDate(): Date {
    return new Date(1900, 0, 31);
  }

  private getDaysBetween(date1: Date, date2: Date): number {
    const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.floor((d2.getTime() - d1.getTime()) / (24 * 60 * 60 * 1000));
  }

  private toSolarStruct(date: Date): SolarDate {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  }
}
