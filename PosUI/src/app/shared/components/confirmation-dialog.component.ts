import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialog } from '../models/confirmation-dialog.model';
import { LoaderService } from '../loader/loader.service';


// @Component({
  // selector: 'confirmation-dialog',
  // template: `
  //   <h1 mat-dialog-title>{{ data.title }}</h1>

  //   <mat-dialog-content [innerHTML]="data.content"></mat-dialog-content>

  //   <mat-dialog-actions *ngIf="!data?.disableActionButtons" fxLayoutAlign="end">
  //     <button
  //       mat-raised-button
  //       [mat-dialog-close]="true"
  //       color="accent"
  //       class="white-text"
  //       [disabled]="loaderService.isLoading | async"
  //     >
  //       {{ data.confirmButtonText || 'YES' }}
  //     </button>
  //     <button mat-raised-button [mat-dialog-close]="false" color="warn">
  //       {{ data.cancelButtonText || 'NO' }}
  //     </button>
  //   </mat-dialog-actions>
  // `
// })
// export class ConfirmDialogComponent {
//   constructor(
//     public loaderService: LoaderService,
//     @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialog
//   ) {
//   }

//   isTemplateRef(content: any): boolean {
//     if (typeof content !== 'string') {
//       return true;
//     }
//     return false;
//   }
// }