import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as PostActions from './post.actions';
import { Post } from './post.state';

@Injectable()
export class PostEffects {
  private api = environment.apiUrl;

  loadPosts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostActions.loadPosts),
      switchMap(({ search }) =>
        this.http.get<Post[]>(`${this.api}/api/posts${search ? `?search=${search}` : ''}`).pipe(
          map(posts => PostActions.loadPostsSuccess({ posts })),
          catchError(err => of(PostActions.loadPostsFailure({ error: err.error?.message || 'Failed to load posts' })))
        )
      )
    )
  );

  loadUserPosts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostActions.loadUserPosts),
      switchMap(({ userId }) =>
        this.http.get<Post[]>(`${this.api}/api/posts/user/${userId}`).pipe(
          map(posts => PostActions.loadUserPostsSuccess({ posts })),
          catchError(err => of(PostActions.loadUserPostsFailure({ error: err.error?.message || 'Failed to load user posts' })))
        )
      )
    )
  );

  loadPost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostActions.loadPost),
      switchMap(({ id }) =>
        this.http.get<Post>(`${this.api}/api/posts/${id}`).pipe(
          map(post => PostActions.loadPostSuccess({ post })),
          catchError(err => of(PostActions.loadPostFailure({ error: err.error?.message || 'Post not found' })))
        )
      )
    )
  );

  createPost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostActions.createPost),
      switchMap(({ postData }) => {
        let body: FormData | { text: string; tags?: string[] };

        if (postData.files && postData.files.length > 0) {
          const fd = new FormData();
          fd.append('text', postData.text);
          if (postData.tags) {
            postData.tags.forEach(tag => fd.append('tags', tag));
          }
          postData.files.forEach(file => fd.append('attachments', file, file.name));
          body = fd;
        } else {
          body = { text: postData.text, tags: postData.tags };
        }

        return this.http.post<Post>(`${this.api}/api/posts`, body).pipe(
          map(post => PostActions.createPostSuccess({ post })),
          catchError(err => of(PostActions.createPostFailure({ error: err.error?.message || 'Failed to create post' })))
        );
      })
    )
  );

  deletePost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostActions.deletePost),
      switchMap(({ id }) =>
        this.http.delete(`${this.api}/api/posts/${id}`).pipe(
          map(() => PostActions.deletePostSuccess({ id })),
          catchError(err => of(PostActions.loadPostsFailure({ error: err.error?.message || 'Failed to delete post' })))
        )
      )
    )
  );

  updatePost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostActions.updatePost),
      switchMap(({ id, postData }) =>
        this.http.put<Post>(`${this.api}/api/posts/${id}`, postData).pipe(
          map(post => PostActions.updatePostSuccess({ post })),
          catchError(err => of(PostActions.updatePostFailure({ error: err.error?.message || 'Failed to update post' })))
        )
      )
    )
  );

  likePost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostActions.likePost),
      switchMap(({ id }) =>
        this.http.put<Post>(`${this.api}/api/posts/like/${id}`, {}).pipe(
          map(post => PostActions.updatePostInList({ post })),
          catchError(err => of(PostActions.loadPostsFailure({ error: err.error?.message || 'Failed to like post' })))
        )
      )
    )
  );

  unlikePost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostActions.unlikePost),
      switchMap(({ id }) =>
        this.http.put<Post>(`${this.api}/api/posts/unlike/${id}`, {}).pipe(
          map(post => PostActions.updatePostInList({ post })),
          catchError(err => of(PostActions.loadPostsFailure({ error: err.error?.message || 'Failed to unlike post' })))
        )
      )
    )
  );

  addComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostActions.addComment),
      switchMap(({ postId, text }) =>
        this.http.post<Post>(`${this.api}/api/posts/comment/${postId}`, { text }).pipe(
          map(post => PostActions.addCommentSuccess({ post })),
          catchError(err => of(PostActions.loadPostFailure({ error: err.error?.message || 'Failed to add comment' })))
        )
      )
    )
  );

  deleteComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostActions.deleteComment),
      switchMap(({ postId, commentId }) =>
        this.http.delete<Post>(`${this.api}/api/posts/comment/${postId}/${commentId}`).pipe(
          map(post => PostActions.deleteCommentSuccess({ post })),
          catchError(err => of(PostActions.loadPostFailure({ error: err.error?.message || 'Failed to delete comment' })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) {}
}
