import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loadPost, addComment, deleteComment, likePost, unlikePost } from '../../store/post/post.actions';
import { selectPost, selectPostLoading } from '../../store/post/post.selectors';
import { selectCurrentUser, selectIsAuthenticated } from '../../store/auth/auth.selectors';
import { Post } from '../../store/post/post.state';
import { AuthUser } from '../../store/auth/auth.state';
import { SpinnerComponent } from '../shared/spinner/spinner.component';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SpinnerComponent],
  template: `
    <div class="post-page">
      <a routerLink="/feed" class="btn-back">← Back To Feed</a>

      <app-spinner *ngIf="loading$ | async"></app-spinner>

      <ng-container *ngIf="!(loading$ | async) && (post$ | async) as post">

        <!-- ── Main Post Card ── -->
        <article class="main-post-card">

          <!-- Author header -->
          <div class="post-header">
            <a [routerLink]="['/profile', post.user]" class="author-link">
              <img [src]="post.avatar" [alt]="post.name" class="author-avatar" *ngIf="post.avatar">
              <div class="author-avatar placeholder" *ngIf="!post.avatar">
                {{ post.name?.charAt(0)?.toUpperCase() }}
              </div>
            </a>
            <div class="author-meta">
              <a [routerLink]="['/profile', post.user]" class="author-name">{{ post.name }}</a>
              <span class="post-time">{{ post.createdAt | date:'MMMM d, y · h:mm a' }}</span>
            </div>
            <div class="post-badges">
              <span class="views-badge" *ngIf="post.views">👁 {{ post.views }} views</span>
            </div>
          </div>

          <!-- Tags -->
          <div class="tags-row" *ngIf="post.tags?.length">
            <span class="tag" *ngFor="let tag of post.tags">{{ tag }}</span>
          </div>

          <!-- Post body -->
          <div class="post-body">
            <p class="post-text">{{ post.text }}</p>
          </div>

          <!-- ── Vote + Action Bar ── -->
          <div class="action-bar">

            <!-- Upvote group -->
            <div class="vote-group">
              <button class="vote-btn upvote"
                      [class.voted]="hasLiked(post, (currentUser$ | async))"
                      (click)="onLike(post._id)"
                      [disabled]="!(isAuthenticated$ | async)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                </svg>
                <span class="vote-count">{{ post.likes?.length || 0 }}</span>
                Upvote
              </button>

              <div class="vote-divider"></div>

              <button class="vote-btn downvote"
                      (click)="onUnlike(post._id)"
                      [disabled]="!(isAuthenticated$ | async)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/>
                </svg>
              </button>
            </div>

            <!-- Stats -->
            <div class="action-stat">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="opacity:0.5">
                <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/>
              </svg>
              {{ post.comments?.length || 0 }} {{ post.comments?.length === 1 ? 'Answer' : 'Answers' }}
            </div>

            <!-- Share -->
            <button class="action-btn" (click)="onShare(post._id)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
              </svg>
              Share
            </button>

            <!-- Copied toast -->
            <span class="copied-toast" *ngIf="copied">Link copied! ✓</span>
          </div>

          <!-- Who liked this -->
          <div class="likers-row" *ngIf="post.likes?.length">
            <span class="likers-label">Upvoted by {{ post.likes?.length }} {{ post.likes?.length === 1 ? 'person' : 'people' }}</span>
          </div>
        </article>

        <!-- ── Comment Form ── -->
        <div class="comment-form-card" *ngIf="isAuthenticated$ | async">
          <div class="cf-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#a78bfa">
              <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/>
            </svg>
            Write an Answer
          </div>
          <form [formGroup]="form" (ngSubmit)="onAddComment(post._id)">
            <textarea formControlName="text" placeholder="Share your thoughts, experience, or answer..." rows="4"></textarea>
            <span class="field-error" *ngIf="form.get('text')?.touched && form.get('text')?.invalid">Answer cannot be empty</span>
            <div class="cf-footer">
              <span class="char-count" [class.warn]="(form.get('text')?.value?.length || 0) > 800">
                {{ form.get('text')?.value?.length || 0 }} / 1000
              </span>
              <button type="submit" class="btn-submit" [disabled]="form.invalid">Post Answer</button>
            </div>
          </form>
        </div>

        <div class="login-cta" *ngIf="!(isAuthenticated$ | async)">
          <a routerLink="/login">Log in</a> to upvote or leave an answer.
        </div>

        <!-- ── Comments / Answers ── -->
        <div class="answers-section" *ngIf="post.comments?.length">
          <h2 class="answers-title">{{ post.comments?.length }} {{ post.comments?.length === 1 ? 'Answer' : 'Answers' }}</h2>

          <div class="answer-card" *ngFor="let comment of post.comments">
            <div class="answer-author">
              <a [routerLink]="['/profile', comment.user]">
                <img [src]="comment.avatar" [alt]="comment.name" class="answer-avatar" *ngIf="comment.avatar">
                <div class="answer-avatar placeholder" *ngIf="!comment.avatar">
                  {{ comment.name?.charAt(0)?.toUpperCase() }}
                </div>
              </a>
              <div class="answer-meta">
                <a [routerLink]="['/profile', comment.user]" class="answer-name">{{ comment.name }}</a>
                <span class="answer-time">{{ comment.createdAt | date:'MMM d, y · h:mm a' }}</span>
              </div>
              <button *ngIf="canDelete(comment, (currentUser$ | async), post)"
                      class="btn-delete-comment"
                      (click)="onDeleteComment(post._id, comment._id!)"
                      title="Delete answer">✕</button>
            </div>
            <p class="answer-text">{{ comment.text }}</p>
          </div>
        </div>

        <div class="no-answers" *ngIf="!post.comments?.length">
          <div class="no-answers-icon">💬</div>
          <p>No answers yet. Be the first to answer!</p>
        </div>

      </ng-container>
    </div>
  `,
  styles: [`
    .post-page { max-width: 820px; margin: 0 auto; padding: 2rem 1.5rem; }
    .btn-back { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.5rem 1rem; background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.3); color: #a78bfa; border-radius: 8px; text-decoration: none; margin-bottom: 1.5rem; font-weight: 600; font-size: 0.9rem; transition: all 0.15s; }
    .btn-back:hover { background: rgba(99,102,241,0.2); }

    /* Main post card */
    .main-post-card { background: rgba(15,23,42,0.85); border: 1px solid rgba(99,102,241,0.2); border-radius: 16px; padding: 2rem; margin-bottom: 1.5rem; backdrop-filter: blur(12px); }

    /* Author row */
    .post-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem; }
    .author-link { text-decoration: none; flex-shrink: 0; }
    .author-avatar { width: 52px; height: 52px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(99,102,241,0.4); }
    .author-avatar.placeholder { background: linear-gradient(135deg,#6366f1,#8b5cf6); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 1.2rem; }
    .author-meta { flex: 1; display: flex; flex-direction: column; gap: 0.2rem; }
    .author-name { color: #e2e8f0; font-weight: 700; font-size: 1rem; text-decoration: none; }
    .author-name:hover { color: #a78bfa; }
    .post-time { color: #475569; font-size: 0.8rem; }
    .post-badges { display: flex; gap: 0.5rem; align-items: center; }
    .views-badge { color: #64748b; font-size: 0.78rem; padding: 0.2rem 0.6rem; background: rgba(99,102,241,0.08); border-radius: 20px; border: 1px solid rgba(99,102,241,0.12); }

    /* Tags */
    .tags-row { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.25rem; }
    .tag { padding: 0.25rem 0.75rem; background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.25); color: #a78bfa; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }

    /* Post text */
    .post-body { margin-bottom: 1.5rem; }
    .post-text { color: #cbd5e1; font-size: 1.1rem; line-height: 1.8; white-space: pre-wrap; }

    /* ── Action Bar ── */
    .action-bar { display: flex; align-items: center; gap: 0.75rem; padding-top: 1.25rem; border-top: 1px solid rgba(99,102,241,0.1); flex-wrap: wrap; }
    .vote-group { display: flex; align-items: center; background: rgba(30,41,59,0.7); border: 1px solid rgba(99,102,241,0.2); border-radius: 30px; overflow: hidden; }
    .vote-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.1rem; background: none; border: none; color: #64748b; font-size: 0.9rem; font-weight: 700; cursor: pointer; transition: all 0.15s; }
    .vote-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .vote-btn:not(:disabled):hover { background: rgba(99,102,241,0.1); color: #e2e8f0; }
    .vote-btn.upvote.voted { color: #6366f1; }
    .vote-btn.upvote.voted svg { fill: #6366f1; }
    .vote-count { font-size: 1rem; font-weight: 800; }
    .vote-divider { width: 1px; height: 22px; background: rgba(99,102,241,0.15); }
    .vote-btn.downvote { padding: 0.6rem 0.85rem; }
    .action-stat { display: flex; align-items: center; gap: 0.4rem; color: #64748b; font-size: 0.875rem; font-weight: 600; padding: 0 0.5rem; }
    .action-btn { display: flex; align-items: center; gap: 0.4rem; padding: 0.55rem 1rem; background: none; border: 1px solid rgba(99,102,241,0.15); border-radius: 24px; color: #64748b; font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 0.15s; }
    .action-btn:hover { border-color: rgba(99,102,241,0.4); color: #e2e8f0; }
    .copied-toast { color: #10b981; font-size: 0.8rem; font-weight: 600; }
    .likers-row { margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid rgba(99,102,241,0.06); }
    .likers-label { color: #475569; font-size: 0.82rem; }

    /* Comment form */
    .comment-form-card { background: rgba(15,23,42,0.8); border: 1px solid rgba(99,102,241,0.2); border-radius: 14px; overflow: hidden; margin-bottom: 1.5rem; }
    .cf-header { display: flex; align-items: center; gap: 0.6rem; padding: 1rem 1.5rem; background: rgba(99,102,241,0.1); color: #a78bfa; font-weight: 700; font-size: 0.95rem; border-bottom: 1px solid rgba(99,102,241,0.1); }
    textarea { width: 100%; box-sizing: border-box; background: rgba(30,41,59,0.4); border: none; border-bottom: 1px solid rgba(99,102,241,0.1); color: #f1f5f9; padding: 1.25rem 1.5rem; font-size: 1rem; resize: vertical; outline: none; font-family: inherit; min-height: 100px; }
    textarea:focus { background: rgba(30,41,59,0.6); border-bottom-color: rgba(99,102,241,0.4); }
    .field-error { color: #f87171; font-size: 0.8rem; padding: 0.25rem 1.5rem; display: block; }
    .cf-footer { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.5rem; }
    .char-count { color: #475569; font-size: 0.8rem; }
    .char-count.warn { color: #f59e0b; }
    .btn-submit { padding: 0.6rem 1.5rem; background: linear-gradient(135deg,#6366f1,#8b5cf6); color: white; border: none; border-radius: 8px; font-weight: 700; font-size: 0.9rem; cursor: pointer; box-shadow: 0 4px 12px rgba(99,102,241,0.3); transition: all 0.15s; }
    .btn-submit:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; }
    .btn-submit:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(99,102,241,0.4); }
    .login-cta { color: #64748b; font-size: 0.9rem; margin-bottom: 1.5rem; padding: 1rem 1.25rem; background: rgba(99,102,241,0.05); border: 1px solid rgba(99,102,241,0.1); border-radius: 10px; }
    .login-cta a { color: #a78bfa; font-weight: 600; text-decoration: none; }

    /* Answers section */
    .answers-title { color: #e2e8f0; font-size: 1.3rem; font-weight: 700; margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 1px solid rgba(99,102,241,0.12); }
    .answer-card { background: rgba(15,23,42,0.6); border: 1px solid rgba(99,102,241,0.1); border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem; transition: border-color 0.2s; }
    .answer-card:hover { border-color: rgba(99,102,241,0.25); }
    .answer-author { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
    .answer-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(99,102,241,0.3); }
    .answer-avatar.placeholder { background: linear-gradient(135deg,#6366f1,#8b5cf6); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 0.95rem; }
    .answer-meta { flex: 1; display: flex; flex-direction: column; gap: 0.1rem; }
    .answer-name { color: #e2e8f0; font-weight: 700; font-size: 0.9rem; text-decoration: none; }
    .answer-name:hover { color: #a78bfa; }
    .answer-time { color: #475569; font-size: 0.75rem; }
    .answer-text { color: #cbd5e1; font-size: 1rem; line-height: 1.75; white-space: pre-wrap; }
    .btn-delete-comment { margin-left: auto; background: none; border: none; color: #475569; cursor: pointer; font-size: 0.85rem; padding: 0.25rem 0.5rem; border-radius: 4px; transition: color 0.15s; }
    .btn-delete-comment:hover { color: #f87171; }
    .no-answers { text-align: center; padding: 3rem 2rem; color: #475569; }
    .no-answers-icon { font-size: 3rem; margin-bottom: 0.75rem; }

    @media (max-width: 600px) {
      .main-post-card { padding: 1.25rem; }
      .action-bar { gap: 0.5rem; }
    }
  `]
})
export class PostComponent implements OnInit {
  form: FormGroup;
  post$: Observable<Post | null>;
  loading$: Observable<boolean>;
  currentUser$: Observable<AuthUser | null>;
  isAuthenticated$: Observable<boolean>;
  copied = false;

  constructor(private fb: FormBuilder, private store: Store, private route: ActivatedRoute) {
    this.form = this.fb.group({ text: ['', [Validators.required, Validators.maxLength(1000)]] });
    this.post$ = this.store.select(selectPost);
    this.loading$ = this.store.select(selectPostLoading);
    this.currentUser$ = this.store.select(selectCurrentUser);
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) this.store.dispatch(loadPost({ id }));
    });
  }

  onLike(id: string)   { this.store.dispatch(likePost({ id })); }
  onUnlike(id: string) { this.store.dispatch(unlikePost({ id })); }

  onAddComment(postId: string) {
    if (this.form.invalid) return;
    this.store.dispatch(addComment({ postId, text: this.form.value.text }));
    this.form.reset();
  }

  onDeleteComment(postId: string, commentId: string) {
    this.store.dispatch(deleteComment({ postId, commentId }));
  }

  onShare(id: string) {
    const url = `${window.location.origin}/post/${id}`;
    navigator.clipboard?.writeText(url).then(() => {
      this.copied = true;
      setTimeout(() => this.copied = false, 2500);
    });
  }

  hasLiked(post: Post, user: AuthUser | null): boolean {
    if (!user) return false;
    return post.likes?.some(l => l.user === user.id) ?? false;
  }

  // Author of post or author of comment can delete a comment
  canDelete(comment: any, user: AuthUser | null, post: Post): boolean {
    if (!user) return false;
    return comment.user === user.id || post.user === user.id;
  }
}
