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
import { AppService } from './app.service';

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
    private readonly injector: Injector,
    private readonly appService: AppService,
  ) {
    this.counter.set(1);
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
