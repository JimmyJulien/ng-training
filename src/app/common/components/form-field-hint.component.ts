import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Message } from 'primeng/message';

@Component({
  selector: 'ngt-form-field-hint',
  template: `
    <p-message severity="contrast" variant="simple" size="small">
      <ng-content />
    </p-message>
  `,
  imports: [Message],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgtFormFieldHint {}
