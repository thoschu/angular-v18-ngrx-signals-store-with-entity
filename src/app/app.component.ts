import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  EffectRef,
  Injector,
  NgZone,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public title = 'EstimateUai';
  protected counter: WritableSignal<number> = signal<number>(0);
  protected doubleCounter: Signal<number> = computed(() => this.counter() * 2);

  constructor(
    private readonly ngZone: NgZone,
    private injector: Injector,
  ) {
    this.counter.set(1);

    // effect(() => {
    //   const val: number = this.counter() * 10;
    //   console.info(val);
    // }, {});

    this.ngZone.onMicrotaskEmpty.subscribe((): void => {
      console.log('onMicrotaskEmpty');
    });

    // ngZone.runOutsideAngular((): void => {
    //   setInterval((): void => {
    //     this.counter.set(this.counter() + 1);
    //   }, 3000);
    // });
  }

  private unusedButtonClick(): void {
    const effectRef: EffectRef = effect(
      () => {
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
    this.counter.update((counter: number) => ++counter);
    this.unusedButtonClick();
  }

  protected down(): void {
    this.counter.update(() => {
      return this.counter() - 1;
    });

    this.unusedButtonClick();
  }
}
