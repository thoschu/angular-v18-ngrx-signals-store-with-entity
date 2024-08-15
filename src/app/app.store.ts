import { computed, effect, EffectRef, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  getState,
  patchState,
  signalStore,
  type,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  addEntity,
  removeEntity,
  setEntities,
  updateAllEntities,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap } from 'rxjs';

import { Post, Posts } from './post/post.model';
import { Comment, Comments } from './comment/comment.model';

interface Profile {
  name: string;
  location: string;
  project: string;
}

export interface AppState {
  id: number;
  name: string;
  project: string;
  location: string;
  // commentItems: Comments;
  // postItems: Posts;
  loading: boolean;
}

const initialAppState: AppState = {
  id: 0,
  name: '...',
  project: 'EstimateAi',
  location: 'Dortmund',
  // commentItems: [],
  // postItems: [],
  loading: false,
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialAppState),
  // withEntities<Comment>(),
  // withEntities<Post>(),
  withEntities({
    entity: type<Comment>(),
    collection: 'comment',
  }),
  withEntities<Post, 'post'>({
    entity: type<Post>(),
    collection: 'post',
  }),
  withComputed(({ project, postEntities, commentEntities }) => ({
    uppercaseProject: computed(() => project().toUpperCase()),
    lengthPostEntities: computed(() => postEntities().length),
    lengthCommentEntities: computed(() => commentEntities().length),
  })),
  withMethods(
    (store, httpClient: HttpClient = inject<HttpClient>(HttpClient)) => {
      return {
        updateName(name: string): void {
          patchState(store, { name });
        },
        addPostItem(item: Post): void {
          patchState(store, addEntity(item, { collection: 'post' }));
        },
        removePostItem(id: number): void {
          patchState(store, removeEntity(id, { collection: 'post' }));
        },
        completeAllComments(): void {
          patchState(
            store,
            updateAllEntities({ completed: true }, { collection: 'comment' }),
          );
        },
        _loadComments: rxMethod<void>(
          pipe(
            switchMap(() =>
              httpClient.get<Comments>('http://localhost:3000/comments').pipe(
                tapResponse(
                  (comments: Comments) => {
                    patchState(
                      store,
                      setEntities(comments, { collection: 'comment' }),
                    );
                  },
                  (err: Error) => console.error(err),
                ),
              ),
            ),
          ),
        ),
        _loadPosts: rxMethod<string>(
          pipe(
            switchMap((path: string) =>
              httpClient.get<Posts>('http://localhost:3000/' + path).pipe(
                tapResponse(
                  (posts: Posts) => {
                    patchState(
                      store,
                      setEntities(posts, { collection: 'post' }),
                    );
                  },
                  (err: Error) => console.error(err),
                ),
              ),
            ),
          ),
        ),
        _loadProfile: rxMethod<void>(
          pipe(
            switchMap(() =>
              httpClient.get<Profile>('http://localhost:3000/profile').pipe(
                tapResponse(
                  (profile: Profile) => {
                    patchState(store, {
                      name: profile.name,
                      project: profile.project,
                      location: profile.location,
                    });
                  },
                  (err: Error) => console.error(err),
                ),
              ),
            ),
          ),
        ),
      };
    },
  ),
  withHooks({
    onInit(store) {
      store._loadProfile();
      store._loadComments();
      store._loadPosts('posts');

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
