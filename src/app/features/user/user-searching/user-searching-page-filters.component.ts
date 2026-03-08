import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { form } from '@angular/forms/signals';
import { InputDateField } from '@common/components/input-date-field.component';
import { InputTextField } from '@common/components/input-text-field.component';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { UserFiltersModel } from '../user.models';
import { UserSearchingPageStore } from './user-searching-page.store';

@Component({
  selector: 'ngt-user-searching-page-filters',
  imports: [ButtonModule, PanelModule, InputTextField, InputDateField],
  templateUrl: './user-searching-page-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
})
export class UserSearchingPageFiltersComponent {
  readonly #userSearchingPageStore = inject(UserSearchingPageStore);

  formModel = signal<Required<UserFiltersModel>>({
    name: '',
    email: '',
    birthdate: '',
  });

  form = form(this.formModel);

  onSubmit() {
    const { name, email, birthdate } = this.form().value();

    const filters: UserFiltersModel = {
      name,
      email,
      birthdate: new Date(birthdate).toLocaleDateString(),
    };

    this.#userSearchingPageStore.loadUsers(filters);
  }
}
