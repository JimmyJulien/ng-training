import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { form } from '@angular/forms/signals';
import { InputTextField } from '@common/components/input-text-field.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { LoginService } from './login.service';

export interface LoginFormModel {
  login: string;
  password: string;
}

@Component({
  selector: 'ngt-login-page',
  imports: [InputTextField, ButtonModule, CardModule, MessageModule],
  template: `
    <p-card>
      <ng-template #header>
        <ng-template #title>Log in</ng-template>
      </ng-template>

      <form class="grid gap-4 p-8" (submit.prevent)="login()">
        <ngt-input-text-field label="Login" [field]="form.login" />
        <ngt-input-text-field
          label="Password"
          [field]="form.password"
          inputType="password"
        />
        @if (areCredentialsInvalid()) {
          <p-message severity="error" variant="simple" size="small">
            Invalid credentials
          </p-message>
        }
        <p-button type="submit" label="Log in" />
      </form>
    </p-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'h-full flex items-center justify-center',
  },
})
export class LoginPage {
  readonly #loginService = inject(LoginService);

  areCredentialsInvalid = this.#loginService.areCredentialsInvalid;

  formModel = signal<LoginFormModel>({
    login: '',
    password: '',
  });

  form = form(this.formModel);

  login() {
    this.#loginService.login(this.form().value());
  }
}
