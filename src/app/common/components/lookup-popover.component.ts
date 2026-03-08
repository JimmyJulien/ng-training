import { CdkDrag } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
} from '@angular/core';

@Component({
  selector: 'ngt-lookup-popover',
  templateUrl: './lookup-popover.component.html',
  imports: [CdkDrag],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LookupPopoverComponent {
  isOpened = input.required<boolean>();

  @HostBinding('class')
  class = 'z-10000';
}
