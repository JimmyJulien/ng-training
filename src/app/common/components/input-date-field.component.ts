import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'ngt-input-date-field',
  imports: [DatePickerModule, MessageModule, FormField],
  template: `
    <div class="grid gap-1 w-full">
      <label [for]="id">{{ label() }}</label>
      <p-datepicker showIcon [inputId]="id" [formField]="field()" />
      @if (error()) {
        <p-message severity="error" variant="simple" size="small">{{
          error()
        }}</p-message>
      } @else if (hint()) {
        <p-message severity="contrast" variant="simple" size="small">{{
          hint()
        }}</p-message>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDateField {
  value = model<Date | null>(null);
  id = crypto.randomUUID();
  label = input.required<string>();
  field = input.required<any>();
  hint = input<string>();
  error = input<string | null>();
}
