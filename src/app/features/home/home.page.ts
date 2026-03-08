import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ngt-home-page',
  template: `
    <div class="h-[calc(100vh-64px)] grid justify-center items-center">
      <div class="grid items-center justify-center text-center">
        <h1 class="text-4xl!">Let's train with</h1>
        <img
          ngSrc="angular_logo.png"
          width="600"
          height="600"
          alt=""
          priority
        />
      </div>
    </div>
  `,
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {}
