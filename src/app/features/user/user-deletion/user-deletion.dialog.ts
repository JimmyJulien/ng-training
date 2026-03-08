import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'ngt-user-deletion.dialog',
  imports: [DialogModule, ButtonModule, TooltipModule],
  templateUrl: './user-deletion.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDeletionDialog {
  readonly #dialogRef = inject(DynamicDialogRef);

  close(value: boolean) {
    this.#dialogRef.close(value);
  }
}
