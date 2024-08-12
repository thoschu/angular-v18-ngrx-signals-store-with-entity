import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  EffectCleanupRegisterFn,
  EffectRef,
  Injector,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { SwPush, SwUpdate, VersionEvent } from '@angular/service-worker';
import {
  // filter,
  interval,
  noop,
  take,
  // Observable, Subscription,
  tap,
  timer,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  public title = 'EstimateUai';
  protected counter: WritableSignal<number> = signal<number>(0);
  protected doubleCounter: Signal<number> = computed(
    (): number => this.counter() * 2,
  );

  constructor(
    private readonly injector: Injector,
    private readonly swUpdate: SwUpdate,
    private readonly swPush: SwPush,
    private readonly http: HttpClient,
    protected readonly appService: AppService,
  ) {
    this.counter.set(1);
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

    // this.swUpdate.versionUpdates
    //   .pipe(
    //     tap(console.log),
    //     tap((versionEvent: VersionEvent): void => {
    //       if ('version' in versionEvent && versionEvent.version) {
    //         console.log(`App-Version: ${versionEvent.version.hash}`);
    //       }
    //     }),
    //     filter(
    //       (versionEvent: VersionEvent): boolean =>
    //         versionEvent.type === 'VERSION_READY',
    //     ),
    //   )
    //   .subscribe((versionEvent: VersionEvent): void => {
    //     let text = `New version for the app is available. Do you want to reload?`;
    //
    //     if (
    //       'currentVersion' in versionEvent &&
    //       versionEvent.currentVersion &&
    //       'latestVersion' in versionEvent &&
    //       versionEvent.latestVersion
    //     ) {
    //       const latestVersion = `${versionEvent.latestVersion.hash}`,
    //         currentVersion = `${versionEvent.currentVersion.hash}`;
    //
    //       text = `New version: ${latestVersion} for the app is available. Do you want to reload version: ${currentVersion} ?`;
    //     }
    //
    //     if (confirm(text)) {
    //       document.location.reload();
    //     }
    //   });

    this.swPush.messages.subscribe((message: object): void => {
      console.log('*** swPush: ');
      console.dir(message);
    });

    effect((effectCleanupRegisterFn: EffectCleanupRegisterFn): void => {
      console.dir(effectCleanupRegisterFn);
      console.log(`${this.counter()}`);
    });
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
    this.counter.update((counter: number): number => ++counter);
    this.unusedButtonClick();
  }

  protected down(): void {
    this.counter.update((): number => {
      return this.counter() - 1;
    });

    this.unusedButtonClick();
  }
}
