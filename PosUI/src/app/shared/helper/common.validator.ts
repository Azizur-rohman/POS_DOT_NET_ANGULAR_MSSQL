import {
    AbstractControl,
    AsyncValidatorFn,
    ValidationErrors,
    ValidatorFn,
  } from '@angular/forms';
  import { Observable, of } from 'rxjs';
  import { map } from 'rxjs/operators';
//   import { AsyncValidationService } from '../services/async-validation.service';
  
export class CustomValidators {

static removeSpaces(control: AbstractControl) {
    if (control && control.value && !control.value.replace(/\s/g, '').length) {
      control.setValue('');
    }
    return null;
  }


}