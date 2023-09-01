import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialog } from 'src/app/shared/models/confirmation-dialog.model';
import { LoaderService } from 'src/app/shared/loader/loader.service';

@Component({
  selector: 'confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {

  constructor(
    public loaderService: LoaderService,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialog
  ) {
  }

  isTemplateRef(content: any): boolean {
    if (typeof content !== 'string') {
      return true;
    }
    return false;
  }
}