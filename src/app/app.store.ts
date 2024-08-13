import { HttpClient } from '@angular/common/http';
import { tapResponse } from '@ngrx/operators';
import {
  getState,
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { computed, effect, inject } from '@angular/core';
import { dec, inc } from 'ramda';
import { pipe, switchMap } from 'rxjs';

type Comment = Record<'id' | 'text' | 'postId', string>;
type Comments = Comment[];

type Post = Record<'id' | 'title', string> & Record<'views', number>;
type Posts = Post[];

type Profile = Record<'name', string> & Record<'range', number>;

interface AppState {
  title: string;
  counter: number;
  isLoading: boolean;
  comments: Comments;
  posts: Posts;
  profile: Profile;
}

const initialAppState: AppState = {
  title: 'EstimateUai',
  counter: 0,
  isLoading: false,
  comments: [],
  posts: [],
  profile: {
    name: '1',
    range: 0,
  },
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialAppState),
  withComputed(({ title, counter }) => ({
    uppercaseTitle: computed(() => title().toUpperCase()),
    doubleCounter: computed((): number => counter() * 2),
  })),
  withMethods(
    (store, httpClient: HttpClient = inject<HttpClient>(HttpClient)) => {
      return {
        async loadAll() {
          // const appResult = await appService.getItems();
          // patchState(store, { app: '####' });
        },
        getComments: rxMethod<void>(
          pipe(
            switchMap(() =>
              httpClient.get<Comments>('http://localhost:3000/comments').pipe(
                tapResponse(
                  (comments: Comments) => {
                    patchState(store, { comments });
                  },
                  (err: Error) => console.error(err),
                ),
              ),
            ),
          ),
        ),
        _loadComments() {
          return httpClient
            .get<Comments>('http://localhost:3000/comments')
            .pipe()
            .subscribe((comments: Comments) => {
              patchState(store, { comments });
            });
        },
        getPosts: rxMethod<string>(
          pipe(
            switchMap((path: string) =>
              httpClient.get<Comments>('http://localhost:3000/' + path).pipe(
                tapResponse(
                  (comments: Comments) => {
                    patchState(store, { comments });
                  },
                  (err: Error) => console.error(err),
                ),
              ),
            ),
          ),
        ),
        _loadPosts() {
          return httpClient
            .get<Posts>('http://localhost:3000/posts')
            .pipe()
            .subscribe((posts: Posts) => {
              patchState(store, { posts });
            });
        },
        _loadProfile() {
          return httpClient
            .get<Profile>('http://localhost:3000/profile')
            .pipe()
            .subscribe((profile: Profile) => {
              patchState(store, { profile });
            });
        },
        setCounter(counter: number): void {
          patchState(store, { counter });
        },
        decrementCounter(): void {
          const counter: number = dec(store.counter());

          patchState(store, { counter });
        },
        incrementCounter(): void {
          patchState(store, { counter: inc(store.counter()) });
        },
      };
    },
  ),
  withHooks({
    onInit(store) {
      store._loadComments();
      store.getComments();

      store._loadPosts();
      store.getPosts('posts');

      store._loadProfile();

      effect(() => {
        console.log('[effect] counter state', getState(store));
      }); // logs: { count: 2 }
    },
    onDestroy() {
      console.log('on destroy');
    },
  }),
);
