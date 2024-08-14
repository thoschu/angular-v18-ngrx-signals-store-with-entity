import {
  getState,
  patchState,
  signalStore,
  type,
  withHooks,
  withMethods,
} from '@ngrx/signals';
import { addEntity, withEntities } from '@ngrx/signals/entities';
import { effect } from '@angular/core';

interface AppState {
  id: number;
  title: string;
}

const initialAppState: AppState = {
  id: 1,
  title: 'EstimateUai',
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  // withState(initialAppState),
  // withEntities<AppState>(),
  withEntities({ entity: type<AppState>(), collection: 'app' }),
  // withComputed(({ title, counter }) => ({
  //   uppercaseTitle: computed(() => title().toUpperCase()),
  //   doubleCounter: computed((): number => counter() * 2),
  // })),
  // withComputed(({ appEntities }) => ({
  //   // uppercaseTitle: computed(() => title().toUpperCase()),
  //   // doubleCounter: computed((): number => counter() * 2),
  // })),
  withMethods((store) => {
    //  httpClient: HttpClient = inject<HttpClient>(HttpClient)
    return {
      addAppState(appState: AppState): void {
        patchState(store, addEntity(appState, { collection: 'app' }));
      },
      // _loadComments: rxMethod<void>(
      //   pipe(
      //     switchMap(() =>
      //       httpClient.get<Comments>('http://localhost:3000/comments').pipe(
      //         tapResponse(
      //           (comments: Comments) => {
      //             // patchState(store, { comments });
      //             patchState(
      //               store,
      //               updateAllEntities({ comments }, { collection: 'app' }),
      //             );
      //           },
      //           (err: Error) => console.error(err),
      //         ),
      //       ),
      //     ),
      //   ),
      // ),
      // _loadPosts: rxMethod<string>(
      //   pipe(
      //     switchMap((path: string) =>
      //       httpClient.get<Posts>('http://localhost:3000/' + path).pipe(
      //         tapResponse(
      //           (posts: Posts) => {
      //             // patchState(store, { posts });
      //             patchState(
      //               store,
      //               updateAllEntities({ posts }, { collection: 'app' }),
      //             );
      //           },
      //           (err: Error) => console.error(err),
      //         ),
      //       ),
      //     ),
      //   ),
      // ),
      // _loadProfile: rxMethod<void>(
      //   pipe(
      //     switchMap(() =>
      //       httpClient.get<Profile>('http://localhost:3000/profile').pipe(
      //         tapResponse(
      //           (profile: Profile) => {
      //             // patchState(store, { profile });
      //             patchState(
      //               store,
      //               updateAllEntities({ profile }, { collection: 'app' }),
      //             );
      //           },
      //           (err: Error) => console.error(err),
      //         ),
      //       ),
      //     ),
      //   ),
      // ),
    };
  }),
  withHooks({
    onInit(store) {
      store.addAppState(initialAppState);

      effect(() => {
        console.log('[effect] app state', getState(store));
      }); // logs: { count: 2 }
    },
    onDestroy() {
      console.log('on destroy');
    },
  }),
);
