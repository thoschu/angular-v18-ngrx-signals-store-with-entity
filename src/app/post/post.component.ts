import { Component, input, InputSignal } from '@angular/core';
import { Post } from './post.model';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent {
  readonly post: InputSignal<Post> = input.required<Post>();
}
