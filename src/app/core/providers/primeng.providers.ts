import { EnvironmentProviders } from '@angular/core';
import Material from '@primeuix/themes/material';
import { providePrimeNG } from 'primeng/config';

export const provideCustomPrimeNG = (): EnvironmentProviders[] => [
  providePrimeNG({
    theme: {
      preset: Material,
    },
  }),
];
