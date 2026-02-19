import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { form } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { InputDateField } from '@common/components/input-date-field.component';
import { InputTextField } from '@common/components/input-text-field.component';
import { UserFiltersModel } from '../user.models';
import { UserSearchingPageService } from './user-searching-page.service';

@Component({
  selector: 'ngt-user-searching-page-filters',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatDatepickerModule,
    InputTextField,
    InputDateField,
  ],
  templateUrl: './user-searching-page-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSearchingPageFiltersComponent {
  readonly #userSearchingPageService = inject(UserSearchingPageService);

  formModel = signal<Required<UserFiltersModel>>({
    name: '',
    email: '',
    birthdate: '', // Note: Date mais KO FieldTree
  });

  form = form(this.formModel);

  onSubmit() {
    const { name, email, birthdate } = this.form().value();

    const filters: UserFiltersModel = {
      name,
      email,
      birthdate: new Date(birthdate).toLocaleDateString(),
    };

    this.#userSearchingPageService.filterUserList(filters);
  }
}
