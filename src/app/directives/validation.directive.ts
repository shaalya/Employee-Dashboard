import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
} from '@angular/forms';
import { passwordStrengthValidator } from './custom-validator';

@Directive({
  selector: '[passwordStrength]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ValidationDirective,
      multi: true,
    },
  ],
})
export class ValidationDirective {
  constructor() {}

  validate(control: AbstractControl): ValidationErrors | null {
    return passwordStrengthValidator()(control);
  }
}
