import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  EffectRef,
  Injector,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { SwUpdate } from '@angular/service-worker';

import { AppService } from './app.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public title = ' EstimateUai ';
  protected counter: WritableSignal<number> = signal<number>(0);
  protected doubleCounter: Signal<number> = computed(
    (): number => this.counter() * 2,
  );

  constructor(
    private readonly injector: Injector,
    private readonly swUpdate: SwUpdate,
    protected readonly appService: AppService,
  ) {
    this.counter.set(1);

    interval(4000).subscribe((): void => {
      this.swUpdate
        .checkForUpdate()
        .then((isUpdateAvailable: boolean): void => {
          if (isUpdateAvailable) {
            document.location.reload();
          }
        })
        .catch(console.error)
        .finally(console.info);
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
