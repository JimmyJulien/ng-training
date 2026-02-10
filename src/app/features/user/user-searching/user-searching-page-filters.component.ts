import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Field, form } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { InputDateField } from '../../../common/components/input-date-field.component';
import { InputTextField } from '../../../common/components/input-text-field.component';
import { UserEditionModel } from '../user.models';
import { UserSearchingPageService } from './user-searching-page.service';

@Component({
  selector: 'ngt-user-searching-page-filters',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatExpansionModule,
    MatDatepickerModule,
    Field,
    InputTextField,
    InputDateField,
  ],
  templateUrl: './user-searching-page-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSearchingPageFiltersComponent {
  readonly #userSearchingPageService = inject(UserSearchingPageService);

  formModel = signal<UserEditionModel>({
    name: '',
    email: '',
    birthdate: '',
    pets: [],
    password: '',
  });

  form = form(this.formModel);

  onSubmit() {
    this.#userSearchingPageService.filterUserList(this.form().value());
  }
}
