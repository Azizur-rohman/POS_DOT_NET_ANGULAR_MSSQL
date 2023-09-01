import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ErrorMessageDialogComponent } from './components/error-message-dialog.component';
import { MessageDialogComponent } from './components/message-dialog.component';
import { MaterialModule } from './material.module';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [ MessageDialogComponent, ErrorMessageDialogComponent],
  imports: [
    CommonModule,
    MaterialModule,
    MatDialogModule
  ],

  exports: [
    CommonModule,
    MaterialModule,
    MatDialogModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class SharedModule { }
