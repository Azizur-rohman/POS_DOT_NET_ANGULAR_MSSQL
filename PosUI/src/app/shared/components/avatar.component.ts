import { Component, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'avatar',
  template: `
    <img
      class="avatar"
      matRipple
      [width]="size || 40"
      [height]="size || 40"
      [src]="imageSrc || defaultSrc"
      onerror="this.src='../../../assets/image/profile_sample.jpg'"
      (click)="onClick()"
    />
  `,
  styles: [
    `
      .avatar {
        border-radius: 50%;
        cursor: pointer;
        border: 2px solid #f5f0f0;
        position: relative;
        margin-bottom: -7px;
    }
    `
  ]
})
export class AvatarComponent {
  @Input() data: any;
  @Input() imageSrc: string;
  @Input() size: number;
  defaultSrc = '../../../assets/image/profile_sample.jpg';

  constructor(private element: ElementRef) {}

  onClick(): void {
    this.element.nativeElement.dispatchEvent(
      new CustomEvent('avatar-click', {
        bubbles: true,
        detail: this.data
      })
    );
  }
}