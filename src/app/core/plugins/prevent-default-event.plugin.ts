/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { EventManagerPlugin } from '@angular/platform-browser';

export class PreventDefaultEventPlugin extends EventManagerPlugin {
  override supports(eventName: string): boolean {
    return eventName.endsWith('.prevent');
  }

  override addEventListener(
    element: HTMLElement,
    eventName: string,
    handler: Function,
  ): Function {
    const originalEventName = eventName.split('.')[0];
    return this.manager.addEventListener(
      element,
      originalEventName,
      (event: Event) => {
        event.preventDefault();
        handler(event);
      },
    );
  }
}
