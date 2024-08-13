import {
  ChangeDetectionStrategy,
  Component,
  effect,
  EffectRef,
  inject,
  Injector,
  Signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JsonPipe } from '@angular/common';

import { AppStore, Posts } from './app.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  #appStore = inject(AppStore);
  public title = this.#appStore.title();
  protected counter: Signal<number> = this.#appStore.counter;
  protected doubleCounter: Signal<number> = this.#appStore.doubleCounter;
  protected posts: Signal<Posts> = this.#appStore.posts;

  constructor(private readonly injector: Injector) {
    this.#appStore.setCounter(1);

    // effect((effectCleanupRegisterFn: EffectCleanupRegisterFn): void => {
    //   console.dir(effectCleanupRegisterFn);
    //   console.log(`${this.counter()}`);
    // });
  }

  private unusedButtonClick(): void {
    const effectRef: EffectRef = effect(
      (): void => {
        const val: number = this.counter() * 10;
        console.info(val);
        effectRef.destroy();
      },
      {
        injector: this.injector,
      },
    );
  }

  protected up(): void {
    this.#appStore.incrementCounter();

    this.unusedButtonClick();
  }

  protected down(): void {
    this.#appStore.decrementCounter();

    this.unusedButtonClick();
  }
}
