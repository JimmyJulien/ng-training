import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ngt-user-deletion.dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './user-deletion.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDeletionDialog {}
