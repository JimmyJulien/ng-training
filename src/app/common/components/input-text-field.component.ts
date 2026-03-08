import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'ngt-input-text-field',
  imports: [InputTextModule, MessageModule, FormField],
  templateUrl: './input-text-field.component.html',
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
