import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JsonPipe } from '@angular/common';

import { AppStore } from './app.store';
import { interval } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

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
  #counterObservable = interval(2000);

  public readonly title = 'EstimateUai';
  public readonly counter: Signal<number> = toSignal(this.#counterObservable, {
    initialValue: 0,
  });

  constructor() {
    console.log(this.#appStore);
    console.log(this.#appStore.appEntities());
    console.log(this.#appStore.appEntityMap());
    console.log(this.#appStore.appIds());
  }
}
