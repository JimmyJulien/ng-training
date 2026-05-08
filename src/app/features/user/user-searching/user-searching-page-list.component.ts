import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { UserModel } from '../user.models';
import { UserSearchingPageStore } from './user-searching-page.store';

@Component({
  selector: 'ngt-user-searching-page-list',
  template: `
    <p-panel class="h-full">
      <ng-template #header>
        <div class="w-full flex justify-between gap-4">
          <h2 class="flex items-center gap-4 mb-0!">
            <span class="pi pi-list"></span>
            User list
          </h2>
          <p-button
            data-testid="create-button"
            icon="pi pi-plus"
            label="Create"
            size="small"
            (click)="createUser()"
          />
        </div>
      </ng-template>

      <p-table
        dataKey="id"
        [loading]="isUserListPending()"
        paginator
        [rows]="10"
        scrollable
        scrollHeight="55vh"
        size="small"
        stripedRows
        [value]="userList()"
      >
        <ng-template #header>
          <tr>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>BIRTH DATE</th>
            <th></th>
          </tr>
        </ng-template>

        <ng-template #loadingbody>
          <tr>
            <td colspan="4">
              <div
                class="min-h-48 grid items-center justify-center text-center"
              >
                <div>
                  <span class="pi pi-search text-4xl!"></span>
                  <p class="text-xl">Loading data...</p>
                </div>
              </div>
            </td>
          </tr>
        </ng-template>

        <ng-template #body let-user>
          <tr>
            <td>
              <a [routerLink]="user.name" class="underline text-primary">
                {{ user.name }}
              </a>
            </td>
            <td>
              {{ user.email }}
            </td>
            <td>
              {{ user.birthdate }}
            </td>
            <td>
              <ul class="flex gap-4 justify-end">
                <li>
                  <p-button
                    icon="pi pi-trash"
                    severity="danger"
                    size="small"
                    ariaLabel="Delete user {{ user.name }}"
                    pTooltip="Delete user {{ user.name }}"
                    (click)="deleteUser(user)"
                  />
                </li>
                <li>
                  <p-button
                    icon="pi pi-pencil"
                    severity="info"
                    size="small"
                    ariaLabel="Edit user {{ user.name }}"
                    pTooltip="Edit user {{ user.name }}"
                    (click)="updateUser(user)"
                  />
                </li>
              </ul>
            </td>
          </tr>
        </ng-template>

        <ng-template #emptymessage>
          <tr>
            <td colspan="4">
              <div
                class="min-h-48 grid items-center justify-center text-center"
              >
                <div>
                  <span class="pi pi-filter-slash text-4xl!"></span>
                  <p class="text-xl">No data found</p>
                </div>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </p-panel>
  `,
  imports: [
    RouterModule,
    ButtonModule,
    TooltipModule,
    ProgressSpinnerModule,
    TableModule,
    DialogModule,
    PanelModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSearchingPageListComponent {
  readonly #userSearchingPageStore = inject(UserSearchingPageStore);

  userList = this.#userSearchingPageStore.userList;
  isUserListPending = this.#userSearchingPageStore.isUserListPending;

  displayedColumns = ['name', 'email', 'birthdate', 'actions'];

  constructor() {
    this.#userSearchingPageStore.loadUsers({});
  }

  createUser() {
    this.#userSearchingPageStore.createUser();
  }

  updateUser(userToUpdate: UserModel) {
    this.#userSearchingPageStore.updateUser(userToUpdate);
  }

  deleteUser(userToDelete: UserModel) {
    this.#userSearchingPageStore.deleteUser(userToDelete);
  }
}
