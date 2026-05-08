import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ngt-form-field',
  template: `
    <div
      [class]="[
        orientation() === 'vertical' ? 'grid' : 'flex',
        'gap-1',
        'w-full',
      ]"
    >
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgtFormField {
  orientation = input<'horizontal' | 'vertical'>('vertical');
}
