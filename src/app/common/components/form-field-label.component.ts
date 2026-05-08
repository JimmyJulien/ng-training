import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ngt-form-field-label',
  template: `
    <label [for]="for()">
      <ng-content />
      @if (required()) {
        <span class="text-red-500">*</span>
      }
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgtFormFieldLabel {
  for = input.required<string>();
  required = input<boolean>(false);
}
