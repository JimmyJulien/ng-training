import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'ngt-input-date-field',
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, FormField],
  templateUrl: './input-date-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDateField {
  label = input.required<string>();
  field = input.required<FieldTree<string, string>>();
  hint = input<string>();
  error = input<string>();
}
