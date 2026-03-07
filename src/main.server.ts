import {
  BootstrapContext,
  bootstrapApplication,
} from '@angular/platform-browser';
import { App } from '@core/components/app.component';
import { config } from '@core/configs/app.config.server';

const bootstrap = (context: BootstrapContext) =>
  bootstrapApplication(App, config, context);

export default bootstrap;
