import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, EMPTY, filter, map, mergeMap, of, tap } from 'rxjs';
import { AppService } from '../../../core/services/app.service';
import { UserDeletionDialog } from '../user-deletion/user-deletion.dialog';
import { UserEditionDialog } from '../user-edition/user-edition.dialog';
import { UserEditionModel, UserFiltersModel, UserModel } from '../user.models';
import { UserRepository } from '../user.repository';

@Injectable({
  providedIn: 'root',
})
export class UserSearchingPageService {
  readonly #userRepository = inject(UserRepository);
  readonly #stateService = inject(AppService);
  readonly #dialog = inject(MatDialog);
  readonly #snackbar = inject(MatSnackBar);

  #userFilters = signal<UserFiltersModel>({});

  #userList = rxResource({
    params: this.#userFilters,
    stream: (resourceParams) => {
      return this.#userRepository.getUsers(resourceParams.params).pipe(
        catchError((error: unknown) => {
          let message = 'An error occurred';

          if (error instanceof HttpErrorResponse) {
            message = error.message;
          }

          this.#snackbar.open(`Error: ${message}`, 'Close');

          return of([]);
        }),
      );
    },
  });

  userList = this.#userList.asReadonly();

  filterUserList(filters: Partial<UserEditionModel>) {
    this.#userFilters.set({ ...filters });
  }

  #userToEdit = signal<UserModel | undefined>(undefined);

  editUser(userToEdit: UserModel) {
    this.#userToEdit.set(userToEdit);
  }

  // eslint-disable-next-line no-unused-private-class-members
  #editUserAction = toSignal(
    toObservable(this.#userToEdit).pipe(
      filter((userToEdit) => {
        return !!userToEdit;
      }),
      mergeMap((userToEdit) => {
        return this.#dialog
          .open(UserEditionDialog, {
            disableClose: true,
            width: '50vw',
            data: userToEdit,
          })
          .afterClosed();
      }),
      filter((userToEdit: UserModel | undefined) => {
        return !!userToEdit;
      }),
      tap(() => {
        this.#stateService.lockUi();
      }),
      mergeMap((userToEdit) => {
        if (userToEdit.id) {
          return this.#userRepository.updateUser(userToEdit);
        } else {
          return this.#userRepository.createUser(userToEdit);
        }
      }),
      tap(() => {
        this.#stateService.unlockUi();
        this.#snackbar.open('User created !', 'Close');
        this.#userList.reload();
        this.#userToEdit.set(undefined);
      }),
      catchError((error: unknown) => {
        this.#stateService.unlockUi();

        let message = 'An error occurred';

        if (error instanceof HttpErrorResponse) {
          message = error.message;
        }

        this.#snackbar.open(`Error: ${message}`, 'Close');

        this.#userToEdit.set(undefined);

        return EMPTY;
      }),
    ),
  );

  #userToDelete = signal<UserModel | undefined>(undefined);

  deleteUser(userToDelete: UserModel) {
    this.#userToDelete.set(userToDelete);
  }

  // eslint-disable-next-line no-unused-private-class-members
  #deleteUserAction = toSignal(
    toObservable(this.#userToDelete).pipe(
      filter(
        (userToDelete: UserModel | undefined) => userToDelete !== undefined,
      ),
      mergeMap((userToDelete: UserModel) => {
        return this.#dialog
          .open(UserDeletionDialog, {
            disableClose: true,
          })
          .afterClosed()
          .pipe(
            map((isConfirmed: boolean) => {
              if (!isConfirmed) {
                this.#userToDelete.set(undefined);
                return undefined;
              }

              return userToDelete;
            }),
          );
      }),
      filter((userToDelete: UserModel | undefined) => !!userToDelete),
      tap(() => {
        this.#stateService.lockUi();
      }),
      mergeMap((userToDelete: UserModel) =>
        this.#userRepository.deleteUser(userToDelete.id),
      ),
      tap(() => {
        this.#stateService.unlockUi();
        this.#snackbar.open('User deleted !', 'Close');
        this.#userList.reload();
      }),
      catchError((error: unknown) => {
        this.#stateService.unlockUi();

        let message = 'An error occurred';

        if (error instanceof HttpErrorResponse) {
          message = error.message;
        }

        this.#snackbar.open(`Error: ${message}`, 'Close');

        this.#userToEdit.set(undefined);

        return EMPTY;
      }),
    ),
  );
}
