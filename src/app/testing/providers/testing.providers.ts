import { provideHttpClientTesting } from '@angular/common/http/testing';
import { appProviders } from '@core/providers/app.providers';

export const testingProviders = [...appProviders, provideHttpClientTesting()];
