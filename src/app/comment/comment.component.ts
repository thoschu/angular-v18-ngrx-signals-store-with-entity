import { Component, input, InputSignal } from '@angular/core';

import { Comment } from './comment.model';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  readonly comment: InputSignal<Comment> = input.required<Comment>();
}
