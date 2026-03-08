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
  templateUrl: './input-date-field.component.html',
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
