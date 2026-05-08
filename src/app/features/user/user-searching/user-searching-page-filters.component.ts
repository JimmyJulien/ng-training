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
  template: `
    <p-panel class="h-full">
      <ng-template #header>
        <h2 class="flex items-center gap-4 mb-0! min-h-11.5">
          <span class="pi pi-filter"></span>
          Filters
        </h2>
      </ng-template>

      <form role="form" class="grid gap-4" (submit.prevent)="onSubmit()">
        <ngt-input-text-field label="Name" [field]="form.name" />

        <ngt-input-text-field label="Email" [field]="form.email" />

        <ngt-input-date-field label="Birth Date" [field]="form.birthdate" />

        <div class="flex items-center justify-center">
          <p-button
            icon="pi pi-filter"
            label="Filter"
            size="small"
            type="submit"
            variant="outlined"
          />
        </div>
      </form>
    </p-panel>
  `,
  imports: [ButtonModule, PanelModule, InputTextField, InputDateField],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
