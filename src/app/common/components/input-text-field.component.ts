import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { Field, FieldTree } from '@angular/forms/signals';
import {
  MatFormFieldModule,
  SubscriptSizing,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'ngt-input-text-field',
  imports: [MatFormFieldModule, MatInputModule, Field],
  templateUrl: './input-text-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTextField {
  label = input.required<string>();
  field = input.required<FieldTree<string, string | number>>();
  inputType = input<'text' | 'password'>('text');
  hint = input<string>();
  error = input<string>();
  noMarginBottom = input<boolean>(true);

  subscriptSizing = computed<SubscriptSizing>(() => {
    return this.noMarginBottom() ? 'dynamic' : 'fixed';
  });
}
