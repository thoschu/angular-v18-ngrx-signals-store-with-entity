import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { interval, Observable } from 'rxjs';

import { AppStore } from './app.store';
import { Comments } from './comment/comment.model';
import { Posts } from './post/post.model';
import { CommentComponent } from './comment/comment.component';
import { PostComponent } from './post/post.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommentComponent, PostComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly #appStore = inject(AppStore);
  readonly #counterObservable: Observable<number> = interval(500);

  protected postEntities: Signal<Posts> = this.#appStore.postEntities;
  protected commentEntities: Signal<Comments> = this.#appStore.commentEntities;

  public readonly name = this.#appStore.name;
  public readonly project = this.#appStore.uppercaseProject;
  public readonly runner: Signal<number> = toSignal(this.#counterObservable, {
    initialValue: 0,
  });

  constructor() {
    setTimeout(() => {
      this.#appStore.updateName('adesso SE');

      this.#appStore.completeAllComments();
    }, 5000);

    console.log(this.#appStore.postIds);
    console.log(this.#appStore.postEntities);
    console.log(this.#appStore.postEntityMap());
  }
}
