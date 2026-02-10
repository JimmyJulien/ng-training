import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/core/components/app.component';
import { appConfig } from './app/core/configs/app.config';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
