import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private readonly http: HttpClient) {
    if (typeof Worker !== 'undefined') {
      const worker: Worker = new Worker(
        new URL('./app.worker', import.meta.url),
      );

      worker.onmessage = ({ data }) => {
        console.log(data);
      };

      http.get('http://localhost:3000/posts').subscribe((value: object) => {
        worker.postMessage(value);
      });
    } else {
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }
}
