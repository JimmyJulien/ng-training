import { effect, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { MessageService } from 'primeng/api';
import { catchError, EMPTY, Observable, of, pipe, switchMap, tap } from 'rxjs';
import { UserModel } from '../user.models';
import { UserRepository } from '../user.repository';

export interface UserEditionDialogState {
  representantList: UserModel[];
  isRepresentantListPending: boolean;
}

const initialState: UserEditionDialogState = {
  representantList: [],
  isRepresentantListPending: false,
};

export const UserEditionDialogStore = signalStore(
  withState<UserEditionDialogState>(initialState),
  withMethods((store) => {
    const userRepository = inject(UserRepository);
    const messageService = inject(MessageService);

    const loadRepresentants = rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isRepresentantListPending: true })),
        switchMap(() =>
          userRepository.getUsers({}).pipe(
            catchError((error) => {
              patchState(store, {
                isRepresentantListPending: false,
              });
              return handleError({
                error,
                functionalMessage: 'Error fetching representants',
                returnedValue: of([]),
              });
            }),
          ),
        ),
        tap((representantList) =>
          patchState(store, {
            representantList,
            isRepresentantListPending: false,
          }),
        ),
      ),
    );

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
      messageService.add({
        severity: 'error',
        summary: 'Error !',
        detail: functionalMessage,
      });
      return returnedValue;
    };

    return {
      loadUsers: loadRepresentants,
    };
  }),
  withHooks({
    onInit: (store) => {
      store.loadUsers();

      effect(() => {
        console.debug(
          'user-edition-dialog-store:isRepresentantListPending',
          store.isRepresentantListPending(),
        );

        console.debug(
          'user-searching-page-store:representantList',
          store.representantList(),
        );
      });
    },
  }),
);
