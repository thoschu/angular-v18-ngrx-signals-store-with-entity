import { ChangeDetectionStrategy, Component, NgZone } from '@angular/core';
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
  protected counter = 0;

  constructor(private ngZone: NgZone) {
    ngZone.onMicrotaskEmpty.subscribe((): void => {
      console.log('onMicrotaskEmpty');
    });

    this.ngZone.runOutsideAngular((): void => {
      setInterval((): void => {
        this.counter++;
      }, 3000);
    });
  }

  protected up(): void {
    this.counter++;
  }

  protected down(): void {
    this.counter--;
  }
}
