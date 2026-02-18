import { inject, Injectable, signal } from '@angular/core';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppService } from '@core/services/app.service';
import {
  catchError,
  EMPTY,
  filter,
  map,
  mergeMap,
  Observable,
  of,
  tap,
} from 'rxjs';
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
          return this.#handleError({
            error,
            functionalMessage: 'Error fetching users',
            returnedValue: of([]),
          });
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
      filter((userToEdit) => !!userToEdit),
      mergeMap((userToEdit) => this.#openEditionDialog(userToEdit)),
      filter((userToEdit) => !!userToEdit),
      tap(() => this.#stateService.lockUi()),
      mergeMap((userToEdit) => this.#editUser(userToEdit)),
      tap(() => {
        this.#stateService.unlockUi();
        this.#snackbar.open('User created !', 'Close');
        this.#userList.reload();
        this.#userToEdit.set(undefined);
      }),
      catchError((error: unknown) => {
        this.#stateService.unlockUi();
        this.#userToEdit.set(undefined);

        return this.#handleError({
          error,
          functionalMessage: 'Error editing user',
        });
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
      mergeMap((userToDelete: UserModel) =>
        this.#openDeletionDialog(userToDelete),
      ),
      filter((userToDelete: UserModel | undefined) => !!userToDelete),
      tap(() => this.#stateService.lockUi()),
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
        this.#userToDelete.set(undefined);

        return this.#handleError({
          error,
          functionalMessage: 'Error deleting user',
        });
      }),
    ),
  );

  #openEditionDialog(userToEdit: UserModel): Observable<UserModel | undefined> {
    return this.#dialog
      .open(UserEditionDialog, {
        disableClose: true,
        width: '50vw',
        data: userToEdit,
      })
      .afterClosed();
  }

  #openDeletionDialog(
    userToDelete: UserModel,
  ): Observable<UserModel | undefined> {
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
  }

  #editUser(userToEdit: UserModel) {
    if (userToEdit.id) {
      return this.#userRepository.updateUser(userToEdit);
    } else {
      return this.#userRepository.createUser(userToEdit);
    }
  }

  #handleError<T>({
    error,
    functionalMessage,
    returnedValue = EMPTY,
  }: {
    error: unknown;
    functionalMessage: string;
    returnedValue?: Observable<T>;
  }) {
    console.error(functionalMessage, error);
    this.#snackbar.open(functionalMessage, 'Close');
    return returnedValue;
  }
}
