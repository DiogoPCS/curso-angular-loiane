import { FormArray, FormControl, FormGroup } from '@angular/forms';

export class FormValidations {

  static requiredMinCheckbox(min = 1) {
    const validator = (formArray: FormArray) => {
      const totalChecked = formArray.controls
        .map(v => v.value)
        .reduce((total, current) => current ? total + current : total, 0);
      return totalChecked >= min ? null : { required: true };
    };
    return validator;
  }

  static cepValidator(control: FormControl) {
    const cep = control.value;
    if ( cep && cep !== '') {
      const validacep = /^[0-9]{8}$/;
      return validacep.test(cep) ? null : { cepInvalido: true};
    }
    return null;
  }

  static equalsTo(otherField: string) {
      return (formControl: FormControl) => {

        if (otherField == null) {
          throw new Error('É necessário informar um campo.');
        }

        /* se o formulario ainda não foi totalmente renderizado */
        if (!formControl.root || !(<FormGroup> formControl.root).controls) {
            return null;
        }

        /* root -> acessa todo o form control */
        const field = (<FormGroup> formControl.root).get(otherField);

        if (!field) {
          throw new Error('É necessário informar um campo válido');
        }

        if (field.value !== formControl.value) {
          return { equalsTo: otherField};
        }
        return null;
      };
  }
}
