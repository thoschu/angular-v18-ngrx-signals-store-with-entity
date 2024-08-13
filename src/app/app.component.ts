import {
  ChangeDetectionStrategy,
  Component,
  effect,
  EffectRef,
  inject,
  Injector,
  OnInit,
  Signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { SwPush, SwUpdate, VersionEvent } from '@angular/service-worker';
import { interval, noop, take, tap, timer } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { AppStore, Posts } from './app.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  #appStore = inject(AppStore);
  public title = this.#appStore.title();
  protected counter: Signal<number> = this.#appStore.counter;
  protected doubleCounter: Signal<number> = this.#appStore.doubleCounter;
  protected posts: Signal<Posts> = this.#appStore.posts;

  constructor(
    private readonly injector: Injector,
    private readonly swUpdate: SwUpdate,
    private readonly swPush: SwPush,
    private readonly http: HttpClient,
  ) {
    this.#appStore.setCounter(1);
    const swUpdateVersionUpdates = this.swUpdate.versionUpdates;

    swUpdateVersionUpdates
      .pipe(
        take(1),
        tap((versionEvent: VersionEvent): void => {
          if ('version' in versionEvent && versionEvent.version) {
            console.log(`App-Version: ${versionEvent.version.hash}`);
          }
        }),
      )
      .subscribe(noop);

    interval(4000).subscribe((): void => {
      this.swUpdate
        .checkForUpdate()
        .then((isUpdateAvailable: boolean): void => {
          if (isUpdateAvailable) {
            swUpdate.activateUpdate().then((activated: boolean): void => {
              console.log(activated);
              if (activated) {
                timer(2000).subscribe((): void => {
                  document.location.reload();
                });
              }
            });
          }
        })
        .catch(console.error);
    });

    this.swPush.messages.subscribe((message: object): void => {
      console.log('*** swPush: ');
      console.dir(message);
    });

    // effect((effectCleanupRegisterFn: EffectCleanupRegisterFn): void => {
    //   console.dir(effectCleanupRegisterFn);
    //   console.log(`${this.counter()}`);
    // });
  }

  async ngOnInit() {
    try {
      await this.swPush
        .requestSubscription({
          serverPublicKey:
            'BFiacf4iUXswBl8fe7jcZJ68n_EdTK6U-9hmjZr-yn1XIFZtGbMSPU5MTpdPr7MwgNiXlFGvR3Lm4YEXWgTCWuo',
        })
        .then((pushSubscription: PushSubscription): void => {
          timer(7000).subscribe((): void => {
            this.http
              .post('http://localhost:3333/subscribe', pushSubscription)
              .subscribe(console.info);
          });
        })
        .catch((err) =>
          console.error('Could not subscribe to notifications', err),
        );
    } catch (err) {
      console.error('Could not subscribe due to:', err);
    }
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
