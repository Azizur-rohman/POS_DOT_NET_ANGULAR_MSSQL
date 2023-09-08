import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserActivityService {
  private loginTime: Date | null = null;
  elapsedTime: number | null = null;

  startLoginTimer(): void {
    this.loginTime = new Date();
  }

  getElapsedLoginTime(): number | null {
    if (this.loginTime) {
      const currentTime = new Date();
      return (currentTime.getTime() - this.loginTime.getTime()) / 1000; // Convert to seconds
    }
    return null;
  }

  logout(): void {
    if (this.loginTime) {
      this.loginTime = null;
    }
  }
}
