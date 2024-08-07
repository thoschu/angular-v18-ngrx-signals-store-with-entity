import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private static config: Record<'id' | 'name', string> = {
    id: '1',
    name: 'EstimateUai',
  };

  public title: string = AppComponent.config.name;
}
