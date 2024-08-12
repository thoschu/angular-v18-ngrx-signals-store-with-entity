import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

type Id = Record<'id', number>;
type Result = Record<
  'result',
  Record<'id' | 'title' | 'views', string | number>[]
>;
type All = Id & Result;
type Data = Record<'data', All>;

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private readonly appWorker: Worker;
  private readonly _data: WritableSignal<All> = signal<All>({
    id: 0,
    result: [
      {
        id: 0,
        title: '',
        views: '',
      },
    ],
  });

  constructor(private readonly http: HttpClient) {
    this.appWorker = new Worker(new URL('./app.worker', import.meta.url));

    this.appWorker.onmessage = ({ data }: Data): void => {
      console.log(data);
      this.data.set(data);
    };

    this.postsMessage();
  }

  public get data(): WritableSignal<All> {
    return this._data;
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
