import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { NgtFormFieldError } from './form-field-error.component';
import { NgtFormFieldHint } from './form-field-hint.component';
import { NgtFormFieldLabel } from './form-field-label.component';
import { NgtFormField } from './form-field.component';

@Component({
  selector: 'ngt-input-text-field',
  template: `
    <ngt-form-field>
      <ngt-form-field-label [for]="id">
        {{ label() }}
      </ngt-form-field-label>

      <input [id]="id" [type]="inputType()" pInputText [formField]="field()" />

      @if (error()) {
        <ngt-form-field-error>
          {{ error() }}
        </ngt-form-field-error>
      } @else if (hint()) {
        <ngt-form-field-hint>
          {{ hint() }}
        </ngt-form-field-hint>
      }
    </ngt-form-field>
  `,
  imports: [
    InputTextModule,
    MessageModule,
    FormField,
    NgtFormField,
    NgtFormFieldLabel,
    NgtFormFieldError,
    NgtFormFieldHint,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTextField {
  id = crypto.randomUUID();
  label = input.required<string>();
  field = input.required<FieldTree<string, string | number>>();
  inputType = input<'text' | 'password'>('text');
  hint = input<string>();
  error = input<string | null>();
}
