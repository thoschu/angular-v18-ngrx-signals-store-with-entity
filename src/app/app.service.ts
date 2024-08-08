import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private appWorker: Worker;

  constructor(private readonly http: HttpClient) {
    this.appWorker = new Worker(new URL('./app.worker', import.meta.url));

    this.appWorker.onmessage = ({ data }: Record<'data', number>): void => {
      console.log(data);
    };

    this.postsMessage();
  }

  private postsMessage(): void {
    this.http
      .get<Record<'range', number>>('http://localhost:3000/profile')
      .pipe(map((result: Record<'range', number>) => result.range))
      .subscribe((range: number): void => {
        this.appWorker.postMessage(range);
      });
  }
}
