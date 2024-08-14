import {
  getState,
  patchState,
  signalStore,
  // type,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  // addEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { computed, effect, EffectRef } from '@angular/core';

export type Counter = Record<'id', string> | Record<'counter', number>;
export type Counters = Counter[];

export interface AppState {
  id: number;
  title: string;
  // items: Counters;
  loading: boolean;
}

const initialAppState: AppState = {
  id: 0,
  title: 'EstimateAi',
  // items: [],
  loading: false,
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialAppState),
  withEntities<Counter>(),
  //withEntities({ entity: type<Counter>(), collection: 'app' }),
  withComputed(({ title, entities }) => ({
    uppercaseTitle: computed(() => title().toUpperCase()),
    counters: computed(() =>
      entities().push({
        id: '1',
        counter: 1,
      }),
    ),
  })),
  withMethods((store) => {
    //  httpClient: HttpClient = inject<HttpClient>(HttpClient)
    console.log(store);
    return {
      updateTitle(title: string): void {
        patchState(store, { title });
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
      const effectRef: EffectRef = effect(() => {
        console.log('[effect] app state', getState(store));
        console.dir(effectRef);
      });
    },
    onDestroy() {
      console.log('on destroy');
    },
  }),
);
