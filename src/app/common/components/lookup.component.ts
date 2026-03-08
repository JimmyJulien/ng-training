import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  input,
  viewChild,
} from '@angular/core';
import { FieldTree } from '@angular/forms/signals';
import { Popover, PopoverModule } from 'primeng/popover';
import { InputTextField } from './input-text-field.component';

@Component({
  selector: 'ngt-lookup',
  templateUrl: './lookup.component.html',
  imports: [InputTextField, PopoverModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LookupComponent {
  id = crypto.randomUUID();
  label = input.required<string>();
  field = input.required<FieldTree<string, string>>();
  hint = input<string>();
  error = input<string | null>();
  // tableValue = input.required<T[]>();
  // isTableValueLoading = input.required<boolean>();
  // displayedAttribute = input.required<keyof T>();

  // onTableValueSelection(value: T) {
  //   console.log('coucou', value);
  // }

  lookupPopover = viewChild<Popover>('lookupPopover');

  constructor() {
    afterNextRender(() => {
      console.log('coucou', this.lookupPopover());

      this.lookupPopover()?.toggle({});
    });
  }
}
