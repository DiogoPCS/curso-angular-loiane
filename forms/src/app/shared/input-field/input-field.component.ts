import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * NG_VALUE_ACCESSOR -> Usado para fornecer um ControlValueAccessor para controles de formulário.
 * ControlValueAccessor -> Define uma interface que atua como uma ponte entre a API de formulários angulares e um elemento nativo no DOM.
 */

const INPUT_FIELD_VALUE_ACCESSOR: any = { // provider que irá fornercer as informações:
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => InputFieldComponent), // fornece a própria instancia da classe
	multi: true // multiplas intancias
};

@Component({
	selector: 'app-input-field',
	templateUrl: './input-field.component.html',
	styleUrls: ['./input-field.component.css'],
	providers: [INPUT_FIELD_VALUE_ACCESSOR]
})
export class InputFieldComponent implements ControlValueAccessor {

	@Input() classeCss;
	@Input() id: string;
	@Input() label: string;
	@Input() type = 'text';
	@Input() placeholder: string;
	@Input() control;
	@Input() isReadOnly = false;

	private innerValue: any;

	get value() {
		return this.innerValue;
	}

	set value(v: any) {
		if (v !== this.innerValue) {
			this.innerValue = v;
			this.onChangeCb(v);
		}
	}

	onChangeCb: (_: any) => void = () => {
	};
	onTouchedCb: (_: any) => void = () => {
	};

	// seta o valor (campo.value)
	writeValue(v: any): void {
		this.value = v;
	}

	// toda vez que o valor muda
	registerOnChange(fn: any): void {
		this.onChangeCb = fn;
	}

	// toda vez que o campo ganha foc
	registerOnTouched(fn: any): void {
		this.onTouchedCb = fn;
	}

	// quando o campo está desabilitado
	setDisabledState?(isDisabled: boolean): void {
		this.isReadOnly = isDisabled;
	}
}
