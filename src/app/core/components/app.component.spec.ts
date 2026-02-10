import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { render } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './app.component';

@Component({
  selector: 'ngt-test',
  template: `<div data-testid="test">Test</div>`,
})
class Test {}

describe('App', () => {
  // beforeEach(async () => {
  //   await TestBed.configureTestingModule({
  //     imports: [App],
  //   }).compileComponents();
  // });

  // it('should create the app', async () => {
  //   const {findByRole} = await render(App);

  //   const fixture = TestBed.createComponent(App);
  //   const app = fixture.componentInstance;
  //   expect(app).toBeTruthy();
  // });

  // it('should render title', async () => {
  //   const fixture = TestBed.createComponent(App);
  //   await fixture.whenStable();
  //   const compiled = fixture.nativeElement as HTMLElement;
  //   expect(compiled.querySelector('h1')?.textContent).toContain('Hello, ng-training');
  // });

  it('should render title', async () => {
    const { findByRole } = await render(App);

    const title = await findByRole('heading', { level: 1 });

    expect(title.innerText).toBe('Hello, ng-training');
  });

  it('should navigate to test with link', async () => {
    const routes: Routes = [{ path: 'todo', component: Test }];

    const { findByTestId, findByRole } = await render(App, { routes });

    const testLink = await findByRole('link', { name: 'Test' });

    await userEvent.click(testLink);

    const test = await findByTestId('test');

    expect(test).not.toBeNull();
  });

  it('should navigate to test with button', async () => {
    const routes: Routes = [{ path: 'todo', component: Test }];

    const { findByTestId, findByRole } = await render(App, { routes });

    const testButton = await findByRole('button', { name: 'Test' });

    await userEvent.click(testButton);

    const test = await findByTestId('test');

    expect(test).not.toBeNull();
  });
});
