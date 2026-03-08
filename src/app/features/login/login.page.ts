import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
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
  templateUrl: './login.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  @HostBinding('class')
  class = 'h-full flex items-center justify-center';

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
