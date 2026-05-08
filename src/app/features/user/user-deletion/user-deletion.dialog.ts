import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'ngt-user-deletion.dialog',
  imports: [DialogModule, ButtonModule, TooltipModule],
  template: `
    <div class="grid gap-6">
      <p>Are you sure ?</p>

      <div class="flex justify-end gap-4">
        <p-button
          icon="pi pi-times"
          label="No"
          severity="danger"
          size="small"
          variant="outlined"
          (click)="close(false)"
        />
        <p-button
          icon="pi pi-check"
          label="Yes"
          severity="danger"
          size="small"
          (click)="close(true)"
        />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDeletionDialog {
  readonly #dialogRef = inject(DynamicDialogRef);

  close(value: boolean) {
    this.#dialogRef.close(value);
  }
}
