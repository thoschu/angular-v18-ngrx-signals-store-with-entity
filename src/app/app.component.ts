import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { interval, Observable } from 'rxjs';

import { AppStore } from './app.store';
import { CounterComponent } from './counter/counter.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe, CounterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly #appStore = inject(AppStore);
  readonly #counterObservable: Observable<number> = interval(500);

  public readonly title = this.#appStore.uppercaseTitle;
  public readonly runner: Signal<number> = toSignal(this.#counterObservable, {
    initialValue: 0,
  });

  constructor() {
    setTimeout(() => {
      this.#appStore.updateTitle('EstimateUai');
    }, 5000);

    console.log(this.#appStore.ids);
    console.log(this.#appStore.entities());
    console.log(this.#appStore.entityMap());
  }
}
