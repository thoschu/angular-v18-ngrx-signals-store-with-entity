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
  entityConfig,
  removeEntity,
  SelectEntityId,
  setEntities,
  updateAllEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { TranslocoService } from '@jsverse/transloco';
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
  core: Record<'buttonText' | 'hello', string>;
}

const initialAppState: AppState = {
  id: 0,
  name: '...',
  project: 'EstimateAi',
  location: 'Dortmund',
  // commentItems: [],
  // postItems: [],
  loading: false,
  core: {
    buttonText: 'CLICK',
    hello: '✋',
  },
};

const postConfig: {
  entity: Post;
  collection: 'post';
  selectId: SelectEntityId<NoInfer<Post>>;
} = entityConfig({
  entity: type<Post>(),
  collection: 'post',
  selectId: (post: Post) => post.id,
});

// https://ngrx.io/guide/signals/signal-store/entity-management#entity-updaters
export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialAppState),
  // withEntities<Comment>(),
  // withEntities<Post>(),
  withEntities({
    entity: type<Comment>(),
    collection: 'comment',
  }),
  // withEntities<Post, 'post'>({
  //   entity: type<Post>(),
  //   collection: 'post',
  // }),
  withEntities<Post, 'post'>(postConfig),
  withComputed(({ project, postEntities, commentEntities }) => ({
    uppercaseProject: computed(() => project().toUpperCase()),
    lengthPostEntities: computed(() => postEntities().length),
    lengthCommentEntities: computed(() => commentEntities().length),
  })),
  withMethods(
    (
      store,
      httpClient: HttpClient = inject<HttpClient>(HttpClient),
      translocoService: TranslocoService = inject<TranslocoService>(
        TranslocoService,
      ),
    ) => {
      return {
        updateName(name: string): void {
          patchState(store, { name });
        },
        addPostItem(item: Post): void {
          patchState(store, addEntity(item, postConfig));
        },
        removeCommentItem(id: number): void {
          patchState(store, removeEntity(id, { collection: 'comment' }));
        },
        updatePostItem(id: string, views: number): void {
          patchState(
            store,
            updateEntity({ id, changes: { views } }, postConfig),
          );
        },
        completeAllComments(): void {
          patchState(
            store,
            updateAllEntities({ completed: true }, { collection: 'comment' }),
          );
        },
        changeLanguage(lang: string = translocoService.getActiveLang()): void {
          lang = lang === 'en' ? 'de' : 'en';

          translocoService.setActiveLang(lang);
        },
        getInfo(name: string): void {
          translocoService.setActiveLang(name);
        },
        _loadTranslations: rxMethod<void>(
          pipe(
            switchMap(() =>
              translocoService.selectTranslate('hello').pipe(
                tapResponse(
                  (hello: string) => {
                    patchState(store, (state) => ({
                      core: { ...state.core, hello },
                    }));
                  },
                  (err: Error) => console.error(err),
                ),
              ),
            ),
            switchMap(() =>
              translocoService.selectTranslate('buttonText').pipe(
                tapResponse(
                  (buttonText: string) => {
                    patchState(store, (state) => ({
                      core: { ...state.core, buttonText },
                    }));
                  },
                  (err: Error) => console.error(err),
                ),
              ),
            ),
          ),
        ),
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
                    patchState(store, setEntities(posts, postConfig));
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

      store._loadTranslations();

      store.changeLanguage();

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
