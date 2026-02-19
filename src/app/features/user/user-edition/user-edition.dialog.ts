import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  applyEach,
  applyWhenValue,
  debounce,
  email,
  form,
  hidden,
  minLength,
  required,
  validate,
} from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InputDateField } from '@common/components/input-date-field.component';
import { InputTextField } from '@common/components/input-text-field.component';
import { stringBetween, unique } from '@common/validators/common.validators';
import { UserEditionModel } from '../user.models';
import { UserService } from '../user.service';
import { isUnderAge } from '../user.utils';

type UserEditionFormModel = Required<Omit<UserEditionModel, 'id' | 'pets'>> & {
  confirmPassword: string;
  pets: string[];
};

@Component({
  selector: 'ngt-user-edition-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatTooltipModule,
    InputTextField,
    InputDateField,
  ],
  templateUrl: './user-edition.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditionDialog {
  readonly #userService = inject(UserService);

  protected readonly userToEdit = inject<UserEditionModel | undefined>(
    MAT_DIALOG_DATA,
  );

  readonly #dialogRef = inject(MatDialogRef);

  formModel = signal<UserEditionFormModel>({
    name: this.userToEdit?.name ?? '',
    email: this.userToEdit?.email ?? '',
    birthdate: this.userToEdit?.birthdate ?? '',
    representant: this.userToEdit?.representant ?? '',
    pets: this.userToEdit?.pets?.length ? this.userToEdit.pets : [''],
    password: this.userToEdit?.password ?? '',
    confirmPassword: this.userToEdit?.password ?? '',
  });

  form = form(this.formModel, (schema) => {
    required(schema.name, { message: 'Name is required' });
    // CUSTOM VALIDATOR
    stringBetween({ path: schema.name, min: 3, max: 30 });
    // CUSTOM ASYNC VALIDATOR
    unique({
      path: schema.name,
      checkFn: (params: string) => this.#userService.existUserByName(params),
    });

    required(schema.email, { message: 'Email is required' });
    email(schema.email, { message: 'Invalid email' });

    // DEBOUNCING
    debounce(schema.birthdate, 500);
    required(schema.birthdate, { message: 'Birth date is required' });

    // CONDITIONAL VALIDATOR
    applyWhenValue(
      schema,
      (schema) => isUnderAge(schema.birthdate, 16),
      (schema) => {
        required(schema.representant, {
          message: 'Representant is required under 16',
        });
      },
    );

    // HIDDEN
    hidden(
      schema.representant,
      ({ valueOf }) => !isUnderAge(valueOf(schema.birthdate), 16),
    );

    // FORM ARRAY
    applyEach(schema.pets, (schema) => {
      minLength(schema, 2, {
        message: 'Pets name must be min 2 characters long',
      });
    });

    required(schema.password, { message: 'Password is required' });
    minLength(schema.password, 8, {
      message: 'Password must be min 8 characters long',
    });

    required(schema.confirmPassword, { message: 'Password must be confirmed' });
    minLength(schema.confirmPassword, 8, {
      message: 'Password must be min 8 characters long',
    });

    // CROSS FIELD VALIDATOR
    validate(schema.confirmPassword, ({ value, valueOf }) => {
      const confirm = value();
      const password = valueOf(schema.password);

      if (confirm.length && confirm !== password) {
        return {
          kind: 'password_mismatch',
          message: 'Passwords do not match',
        };
      }

      return null;
    });
  });

  addPet() {
    this.formModel.update((f) => {
      return {
        ...f,
        pets: [...f.pets, ''],
      };
    });
  }

  removePet(index: number) {
    this.formModel.update((f) => {
      return {
        ...f,
        pets: f.pets.filter((_, i) => i !== index),
      };
    });
  }

  onSubmit() {
    const { name, email, birthdate, pets, representant, password } =
      this.form().value();

    const userToEdit: UserEditionModel = {
      id: this.userToEdit?.id,
      name,
      email,
      birthdate: new Date(birthdate).toLocaleDateString(),
      pets: pets.filter((p) => !!p),
      password,
    };

    if (representant) {
      userToEdit.representant = representant;
    }

    this.#dialogRef.close(userToEdit);
  }
}
