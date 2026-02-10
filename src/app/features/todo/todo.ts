import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ngt-todo',
  imports: [],
  template: `<p>todo works!</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Todo {}
