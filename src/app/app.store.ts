import { HttpClient } from '@angular/common/http';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { dec, inc } from 'ramda';

interface AppState {
  title: string;
  counter: number;
  isLoading: boolean;
}

const initialAppState: AppState = {
  title: 'EstimateUai',
  counter: 0,
  isLoading: false,
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialAppState),
  withComputed(({ title, counter }) => ({
    uppercaseTitle: computed(() => title().toUpperCase()),
    doubleCounter: computed((): number => counter() * 2),
  })),
  withMethods((store) => {
    const httpClient: HttpClient = inject<HttpClient>(HttpClient);

    return {
      async loadAll() {
        // const appResult = await appService.getItems();
        // patchState(store, { app: '####' });
        httpClient.get('http://localhost:3000/comments').subscribe((res) => {
          console.log(res);
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
        const counter: number = inc(store.counter());

        patchState(store, { counter });
      },
    };
  }),
  withHooks({
    onInit({ loadAll }: { loadAll: () => Promise<unknown> }) {
      loadAll().then((r) => console.log(r));
    },
    onDestroy() {
      console.log('on destroy');
    },
  }),
);
