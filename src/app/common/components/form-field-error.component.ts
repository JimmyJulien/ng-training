import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Message } from 'primeng/message';

@Component({
  selector: 'ngt-form-field-error',
  template: `
    <p-message severity="error" variant="simple" size="small">
      <ng-content />
    </p-message>
  `,
  imports: [Message],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgtFormFieldError {}
