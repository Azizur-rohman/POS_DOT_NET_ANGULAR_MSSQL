import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MonthToSecondService {
  private secondsInMonth: any = {
    January: 31 * 24 * 60 * 60, // 31 days
    February: 28 * 24 * 60 * 60, // 28 days (non-leap year)
    March: 31 * 24 * 60 * 60,
    April: 30 * 24 * 60 * 60,
    May: 31 * 24 * 60 * 60,
    June: 30 * 24 * 60 * 60,
    July: 31 * 24 * 60 * 60,
    August: 31 * 24 * 60 * 60,
    September: 30 * 24 * 60 * 60,
    October: 31 * 24 * 60 * 60,
    November: 30 * 24 * 60 * 60,
    December: 31 * 24 * 60 * 60,
  };

  getSecondsInMonth(monthName: string): number {
    return this.secondsInMonth[monthName] || 0; // Default to 0 if monthName is not recognized
  }
}
