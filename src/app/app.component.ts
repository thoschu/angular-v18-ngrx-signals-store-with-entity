import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JsonPipe } from '@angular/common';

import { AppStore } from './app.store';

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

  title = 'EstimateUai';

  constructor() {
    console.log(this.#appStore);
    console.log(this.#appStore.appEntities());
    console.log(this.#appStore.appIds());
    console.log(this.#appStore.appEntityMap());
  }
}
