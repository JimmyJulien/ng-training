import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppService } from '@core/services/app.service';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  catchError,
  EMPTY,
  exhaustMap,
  filter,
  map,
  Observable,
  of,
  pipe,
  switchMap,
  tap,
} from 'rxjs';
import { UserDeletionDialog } from '../user-deletion/user-deletion.dialog';
import { UserEditionDialog } from '../user-edition/user-edition.dialog';
import { UserEditionModel, UserFiltersModel, UserModel } from '../user.models';
import { UserRepository } from '../user.repository';

export interface UserSearchingPageState {
  userList: UserModel[];
  isUserListPending: boolean;
  userFilters: UserFiltersModel;
}

const initialState: UserSearchingPageState = {
  userList: [],
  isUserListPending: false,
  userFilters: {},
};

export const UserSearchingPageStore = signalStore(
  { providedIn: 'root' },
  withState<UserSearchingPageState>(initialState),
  withMethods((store) => {
    const userRepository = inject(UserRepository);
    const appService = inject(AppService);
    const snackbar = inject(MatSnackBar);
    const dialog = inject(MatDialog);

    const openEditionDialog = (
      userToEdit?: UserModel,
    ): Observable<UserEditionModel | undefined> => {
      return dialog
        .open(UserEditionDialog, {
          disableClose: true,
          width: '50vw',
          data: userToEdit,
        })
        .afterClosed();
    };

    const openDeletionDialog = (
      userToDelete: UserModel,
    ): Observable<UserModel | undefined> => {
      return dialog
        .open(UserDeletionDialog, {
          disableClose: true,
        })
        .afterClosed()
        .pipe(
          map((isConfirmed: boolean) =>
            isConfirmed ? userToDelete : undefined,
          ),
        );
    };

    const handleSuccess = (message: string) => {
      snackbar.open(message, 'Close');
    };

    const handleError = <T>({
      error,
      functionalMessage,
      returnedValue = EMPTY,
    }: {
      error: unknown;
      functionalMessage: string;
      returnedValue?: Observable<T>;
    }) => {
      console.error(functionalMessage, error);
      snackbar.open(functionalMessage, 'Close');
      return returnedValue;
    };

    const getUsers = (
      source$: Observable<UserFiltersModel>,
    ): Observable<UserModel[]> => {
      return source$.pipe(
        tap(() => patchState(store, { isUserListPending: true })),
        switchMap((userFilters) => userRepository.getUsers(userFilters)),
        tap((userList) =>
          patchState(store, { userList, isUserListPending: false }),
        ),
        catchError((error) => {
          patchState(store, {
            isUserListPending: false,
          });
          return handleError({
            error,
            functionalMessage: 'Error fetching users',
            returnedValue: of([]),
          });
        }),
      );
    };

    const loadUsers = rxMethod<UserFiltersModel>(
      pipe(
        tap((userFilters) => patchState(store, { userFilters })),
        getUsers,
      ),
    );

    const createUser = rxMethod<void>(
      pipe(
        exhaustMap(() => openEditionDialog()),
        filter((userToEdit) => !!userToEdit),
        tap(() => appService.lockUi()),
        exhaustMap((userToEdit) => {
          return userRepository.createUser(userToEdit).pipe(
            tap(() => {
              appService.unlockUi();
              handleSuccess('User created !');
            }),
            catchError((error: unknown) => {
              appService.unlockUi();
              return handleError({
                error,
                functionalMessage: 'Error creating user',
              });
            }),
          );
        }),
        map(() => store.userFilters()),
        getUsers,
      ),
    );

    const updateUser = rxMethod<UserModel>(
      pipe(
        exhaustMap(openEditionDialog),
        filter((userToEdit) => !!userToEdit),
        tap(() => appService.lockUi()),
        exhaustMap((userToEdit) => {
          return userRepository.updateUser(userToEdit).pipe(
            tap(() => {
              appService.unlockUi();
              handleSuccess('User updated !');
            }),
            catchError((error: unknown) => {
              appService.unlockUi();
              return handleError({
                error,
                functionalMessage: 'Error updating user',
              });
            }),
          );
        }),
        map(() => store.userFilters()),
        getUsers,
      ),
    );

    const deleteUser = rxMethod<UserModel>(
      pipe(
        exhaustMap(openDeletionDialog),
        filter((userToDelete: UserModel | undefined) => !!userToDelete),
        tap(() => appService.lockUi()),
        exhaustMap((userToDelete: UserModel) =>
          userRepository.deleteUser(userToDelete.id).pipe(
            tap(() => {
              appService.unlockUi();
              handleSuccess('User deleted !');
            }),
            catchError((error: unknown) => {
              appService.unlockUi();
              return handleError({
                error,
                functionalMessage: 'Error deleting user',
              });
            }),
          ),
        ),
        map(() => store.userFilters()),
        getUsers,
      ),
    );

    return {
      loadUsers,
      createUser,
      updateUser,
      deleteUser,
    };
  }),
);
