import { Provider } from '@angular/core';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { PreventDefaultEventPlugin } from '../plugins/prevent-default-event.plugin';

export const provideCustomPlugins = (): Provider[] => [
  {
    provide: EVENT_MANAGER_PLUGINS,
    multi: true,
    useClass: PreventDefaultEventPlugin,
  },
];
