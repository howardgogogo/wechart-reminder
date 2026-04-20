import { Injectable } from '@nestjs/common';
import { ReminderMode, RepeatType } from '../enums';
import { CreateReminderDto } from '../dto/create-reminder.dto';

export interface ParseResult {
  success: boolean;
  data?: CreateReminderDto;
  error?: string;
  line: string;
  lineNumber: number;
}

export interface BatchParseResult {
  valid: ParseResult[];
  invalid: ParseResult[];
  totalLines: number;
}

@Injectable()
export class BatchParserService {
  /**
   * 批量解析文本格式的提醒
   * 格式：
   * 生日:标题-关系-日期(农历/阳历)
   * 会议:标题-时间-地点
   * 上课:标题-时间-教室
   * 日程:标题-时间
   * 自定义:标题-时间-内容
   */
  parseBatchText(text: string): BatchParseResult {
    const lines = text.split('\n').filter((l) => l.trim());
    const result: BatchParseResult = {
      valid: [],
      invalid: [],
      totalLines: lines.length,
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      const lineNumber = index + 1;

      if (!trimmed || trimmed.startsWith('#')) {
        return; // Skip empty lines and comments
      }

      const parseResult = this.parseLine(trimmed, lineNumber);
      if (parseResult.success && parseResult.data) {
        result.valid.push(parseResult);
      } else {
        result.invalid.push(parseResult);
      }
    });

    return result;
  }

  private parseLine(line: string, lineNumber: number): ParseResult {
    try {
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) {
        return {
          success: false,
          error: '格式错误：缺少冒号分隔符',
          line,
          lineNumber,
        };
      }

      const type = line.substring(0, colonIndex).trim();
      const content = line.substring(colonIndex + 1).trim();

      const parts = content.split('-').map((p) => p.trim());
      if (parts.length < 2) {
        return {
          success: false,
          error: '格式错误：字段不足（需要用-分隔）',
          line,
          lineNumber,
        };
      }

      switch (type) {
        case '生日':
          return this.parseBirthday(parts, line, lineNumber);
        case '会议':
          return this.parseMeeting(parts, line, lineNumber);
        case '上课':
          return this.parseClass(parts, line, lineNumber);
        case '日程':
          return this.parseSchedule(parts, line, lineNumber);
        case '自定义':
          return this.parseCustom(parts, line, lineNumber);
        default:
          return {
            success: false,
            error: `未知类型：${type}，支持：生日/会议/上课/日程/自定义`,
            line,
            lineNumber,
          };
      }
    } catch (e) {
      return {
        success: false,
        error: `解析异常：${e.message}`,
        line,
        lineNumber,
      };
    }
  }

  private parseBirthday(parts: string[], line: string, lineNumber: number): ParseResult {
    if (parts.length < 3) {
      return {
        success: false,
        error: '生日格式：生日:标题-关系-日期',
        line,
        lineNumber,
      };
    }

    const [title, relation, dateStr] = parts;
    const isLunar = dateStr.includes('农历');
    const date = this.parseDate(dateStr.replace('农历', ''));

    return {
      success: true,
      line,
      lineNumber,
      data: {
        mode: ReminderMode.BIRTHDAY,
        title,
        content: relation,
        remindTime: date,
        isLunar,
        repeatType: RepeatType.YEARLY,
      } as CreateReminderDto,
    };
  }

  private parseMeeting(parts: string[], line: string, lineNumber: number): ParseResult {
    if (parts.length < 3) {
      return {
        success: false,
        error: '会议格式：会议:标题-时间-地点',
        line,
        lineNumber,
      };
    }

    const [title, time, location] = parts;
    const remindTime = this.parseDateTime(time);

    return {
      success: true,
      line,
      lineNumber,
      data: {
        mode: ReminderMode.MEETING,
        title,
        content: '',
        location,
        remindTime,
        repeatType: RepeatType.ONCE,
      } as CreateReminderDto,
    };
  }

  private parseClass(parts: string[], line: string, lineNumber: number): ParseResult {
    if (parts.length < 3) {
      return {
        success: false,
        error: '上课格式：上课:标题-时间-教室',
        line,
        lineNumber,
      };
    }

    const [title, time, location] = parts;
    const remindTime = this.parseDateTime(time);

    return {
      success: true,
      line,
      lineNumber,
      data: {
        mode: ReminderMode.CLASS,
        title,
        content: '',
        location,
        remindTime,
        repeatType: RepeatType.WEEKLY,
      } as CreateReminderDto,
    };
  }

  private parseSchedule(parts: string[], line: string, lineNumber: number): ParseResult {
    if (parts.length < 2) {
      return {
        success: false,
        error: '日程格式：日程:标题-时间',
        line,
        lineNumber,
      };
    }

    const [title, time] = parts;
    const remindTime = this.parseDateTime(time);

    return {
      success: true,
      line,
      lineNumber,
      data: {
        mode: ReminderMode.SCHEDULE,
        title,
        remindTime,
        repeatType: RepeatType.ONCE,
      } as CreateReminderDto,
    };
  }

  private parseCustom(parts: string[], line: string, lineNumber: number): ParseResult {
    if (parts.length < 2) {
      return {
        success: false,
        error: '自定义格式：自定义:标题-时间-内容',
        line,
        lineNumber,
      };
    }

    const [title, time, content = ''] = parts;
    const remindTime = this.parseDateTime(time);

    return {
      success: true,
      line,
      lineNumber,
      data: {
        mode: ReminderMode.CUSTOM,
        title,
        content,
        remindTime,
        repeatType: RepeatType.ONCE,
      } as CreateReminderDto,
    };
  }

  private parseDate(dateStr: string): Date {
    // 支持格式：3月15、03-15、2026-03-15
    const cleaned = dateStr.replace(/[年月日]/g, '-').replace(/--+/g, '-');
    const parts = cleaned.split('-').filter(Boolean);

    const now = new Date();
    let year = now.getFullYear();
    let month = 1;
    let day = 1;

    if (parts.length === 1) {
      // 15
      day = parseInt(parts[0], 10);
    } else if (parts.length === 2) {
      // 03-15
      month = parseInt(parts[0], 10);
      day = parseInt(parts[1], 10);
    } else if (parts.length >= 3) {
      // 2026-03-15
      year = parseInt(parts[0], 10) || year;
      month = parseInt(parts[1], 10);
      day = parseInt(parts[2], 10);
    }

    return new Date(year, month - 1, day, 9, 0, 0); // Default to 9:00 AM
  }

  private parseDateTime(datetimeStr: string): Date {
    // 支持格式：
    // 2026-04-20 14:00
    // 04-20 14:00
    // 周一 08:00
    // 每天 09:00

    const now = new Date();

    if (datetimeStr.includes('周')) {
      // 周一 08:00 - get next occurrence
      const dayMap: Record<string, number> = {
        '周日': 0, '周一': 1, '周二': 2, '周三': 3, '周四': 4, '周五': 5, '周六': 6,
      };
      const timeMatch = datetimeStr.match(/(\d{1,2}):(\d{2})/);
      let hour = 9;
      let minute = 0;
      if (timeMatch) {
        hour = parseInt(timeMatch[1], 10);
        minute = parseInt(timeMatch[2], 10);
      }
      const dayName = Object.keys(dayMap).find((d) => datetimeStr.includes(d));
      if (dayName) {
        const targetDay = dayMap[dayName];
        const currentDay = now.getDay();
        let daysUntil = targetDay - currentDay;
        if (daysUntil <= 0) daysUntil += 7;
        const targetDate = new Date(now);
        targetDate.setDate(now.getDate() + daysUntil);
        targetDate.setHours(hour, minute, 0, 0);
        return targetDate;
      }
    }

    if (datetimeStr.includes('每天')) {
      const timeMatch = datetimeStr.match(/(\d{1,2}):(\d{2})/);
      let hour = 9;
      let minute = 0;
      if (timeMatch) {
        hour = parseInt(timeMatch[1], 10);
        minute = parseInt(timeMatch[2], 10);
      }
      const target = new Date(now);
      target.setHours(hour, minute, 0, 0);
      return target;
    }

    // 标准日期格式
    const date = this.parseDate(datetimeStr.split(' ')[0]);
    const timeMatch = datetimeStr.match(/(\d{1,2}):(\d{2})/);
    if (timeMatch) {
      date.setHours(parseInt(timeMatch[1], 10), parseInt(timeMatch[2], 10), 0, 0);
    }
    return date;
  }
}
