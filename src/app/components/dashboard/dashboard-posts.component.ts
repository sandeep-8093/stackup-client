import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectCurrentUser } from '../../store/auth/auth.selectors';
import { loadUserPosts, deletePost, updatePost, likePost, unlikePost } from '../../store/post/post.actions';
import { selectUserPosts, selectUserPostsLoading } from '../../store/post/post.selectors';
import { SpinnerComponent } from '../shared/spinner/spinner.component';
import { AuthUser } from '../../store/auth/auth.state';
import { Post } from '../../store/post/post.state';

@Component({
  selector: 'app-dashboard-posts',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SpinnerComponent],
  template: `
    <div class="subpage">

      <div class="subpage-header">
        <div>
          <h2 class="subpage-title">My Posts</h2>
          <p class="subpage-sub">All posts you've published on StackUp</p>
        </div>
        <a routerLink="/feed" class="btn-new-post">+ New Post</a>
      </div>

      <!-- Spinner -->
      <app-spinner *ngIf="loading$ | async"></app-spinner>

      <!-- Empty -->
      <div class="empty-state" *ngIf="!(loading$ | async) && !(userPosts$ | async)?.length">
        <div class="empty-icon">📭</div>
        <h3>No posts yet</h3>
        <p>Share something with the StackUp community!</p>
        <a routerLink="/feed" class="btn-primary">Write your first post →</a>
      </div>

      <!-- Posts List -->
      <div class="posts-list" *ngIf="!(loading$ | async) && (userPosts$ | async)?.length">
        <article class="post-card" *ngFor="let post of (userPosts$ | async)">

          <!-- VIEW MODE -->
          <ng-container *ngIf="editingId() !== post._id">
            <!-- Post Header -->
            <div class="post-header">
              <div class="author-info">
                <a [routerLink]="['/profile', post.user]" class="author-avatar-link">
                  <img [src]="post.avatar" [alt]="post.name" class="author-avatar" *ngIf="post.avatar">
                  <div class="author-avatar placeholder" *ngIf="!post.avatar">
                    {{ post.name?.charAt(0)?.toUpperCase() }}
                  </div>
                </a>
                <div class="author-meta">
                  <a [routerLink]="['/profile', post.user]" class="author-name">{{ post.name }}</a>
                  <span class="post-time">{{ post.createdAt | date:'MMM d, y · h:mm a' }}</span>
                </div>
              </div>
              <div class="post-header-right">
                <div class="tags-row" *ngIf="post.tags?.length">
                  <span class="tag" *ngFor="let tag of post.tags?.slice(0,3)">{{ tag }}</span>
                </div>
              </div>
            </div>

            <!-- Post Content -->
            <div class="post-body">
              <p class="post-text" [class.expanded]="expandedPosts.has(post._id)">
                {{ post.text }}
              </p>
              <button class="btn-readmore"
                      *ngIf="post.text.length > 280 && !expandedPosts.has(post._id)"
                      (click)="toggleExpand(post._id)">
                Read more ›
              </button>

              <!-- Attachments -->
              <div class="post-attachments" *ngIf="post.attachments?.length">
                <ng-container *ngFor="let att of post.attachments">
                  <a *ngIf="att.resourceType === 'image'" [href]="att.url" target="_blank" class="att-image-wrap">
                    <img [src]="att.url" [alt]="att.originalName || 'attachment'" class="att-image"/>
                  </a>
                  <a *ngIf="att.resourceType !== 'image'" [href]="att.url" target="_blank" class="att-file-link">
                    📄 {{ att.originalName || 'Download file' }}
                  </a>
                </ng-container>
              </div>
            </div>

            <!-- Post Footer / Actions -->
            <div class="post-footer">
              <div class="vote-group">
                <button class="vote-btn upvote"
                        [class.voted]="hasLiked(post, (currentUser$ | async))"
                        (click)="onLike(post._id)">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                  </svg>
                  <span>{{ post.likes?.length || 0 }}</span>
                  Upvote
                </button>

                <div class="vote-divider"></div>

                <button class="vote-btn downvote"
                        (click)="onUnlike(post._id)">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/>
                  </svg>
                </button>
              </div>

              <a [routerLink]="['/post', post._id]" class="action-btn comments-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/>
                </svg>
                {{ post.comments?.length || 0 }} {{ post.comments?.length === 1 ? 'Answer' : 'Answers' }}
              </a>
              <button class="action-btn" (click)="startEdit(post)">✏️ Edit</button>
              <button class="action-btn" (click)="onDelete(post._id)" style="color: #f87171;">🗑 Delete</button>
            </div>
          </ng-container>

          <!-- EDIT MODE -->
          <form *ngIf="editingId() === post._id"
                [formGroup]="editForm"
                (ngSubmit)="saveEdit(post._id)"
                class="edit-form">
            <div class="edit-header">
              <span class="edit-label">Editing post</span>
              <span class="edit-chars">{{ editForm.get('text')?.value?.length || 0 }}/1000</span>
            </div>
            <textarea formControlName="text" rows="5" class="edit-textarea"
                      placeholder="Edit your post..."></textarea>
            <input formControlName="tags" type="text" class="edit-tags-input"
                   placeholder="Tags: Angular, TypeScript... (comma-separated)"/>
            <div class="edit-footer">
              <button type="button" class="btn-cancel" (click)="cancelEdit()">Cancel</button>
              <button type="submit" class="btn-save"
                      [disabled]="editForm.invalid">💾 Save Changes</button>
            </div>
          </form>

        </article>
      </div>
    </div>
  `,
  styles: [`
    .subpage { max-width: 800px; }

    /* ── Header ── */
    .subpage-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
    .subpage-title { font-size: 1.6rem; font-weight: 800; color: #f1f5f9; margin: 0 0 0.25rem; }
    .subpage-sub { color: #64748b; font-size: 0.875rem; margin: 0; }
    .btn-new-post { padding: 0.6rem 1.25rem; background: linear-gradient(135deg,#6366f1,#8b5cf6); color: white; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 0.875rem; box-shadow: 0 4px 12px rgba(99,102,241,0.3); transition: all 0.15s; white-space: nowrap; }
    .btn-new-post:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(99,102,241,0.4); }

    /* ── Empty ── */
    .empty-state { text-align: center; padding: 5rem 2rem; background: rgba(15,23,42,0.5); border: 1px dashed rgba(99,102,241,0.2); border-radius: 16px; }
    .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
    .empty-state h3 { color: #e2e8f0; font-size: 1.3rem; margin-bottom: 0.5rem; }
    .empty-state p { color: #64748b; margin-bottom: 1.5rem; }
    .btn-primary { display: inline-block; padding: 0.7rem 1.75rem; background: linear-gradient(135deg,#6366f1,#8b5cf6); color: white; border-radius: 10px; text-decoration: none; font-weight: 700; transition: all 0.15s; }
    .btn-primary:hover { transform: translateY(-1px); }

    /* ── Post Cards ─────────────────────────────────────────── */
    .posts-list { display: flex; flex-direction: column; gap: 0; }
    .post-card {
      background: rgba(15,23,42,0.8); border: 1px solid rgba(99,102,241,0.12);
      border-radius: 12px; padding: 1.5rem 1.75rem;
      margin-bottom: 1px;
      transition: border-color 0.2s, box-shadow 0.2s;
      backdrop-filter: blur(8px);
    }
    .post-card:first-child { border-radius: 12px 12px 0 0; }
    .post-card:last-child  { border-radius: 0 0 12px 12px; margin-bottom: 0; }
    .post-card:only-child  { border-radius: 12px; margin-bottom: 0; }
    .post-card:hover { border-color: rgba(99,102,241,0.3); box-shadow: 0 4px 20px rgba(0,0,0,0.2); }

    /* Post Header */
    .post-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1rem; }
    .author-info { display: flex; align-items: center; gap: 0.75rem; }
    .author-avatar-link { text-decoration: none; }
    .author-avatar {
      width: 44px; height: 44px; border-radius: 50%; object-fit: cover;
      border: 2px solid rgba(99,102,241,0.3);
    }
    .author-avatar.placeholder {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      display: flex; align-items: center; justify-content: center;
      color: white; font-weight: 700; font-size: 1.1rem;
    }
    .author-meta { display: flex; flex-direction: column; gap: 0.15rem; }
    .author-name { color: #e2e8f0; font-weight: 700; text-decoration: none; font-size: 0.95rem; }
    .author-name:hover { color: #a78bfa; text-decoration: underline; }
    .post-time { color: #475569; font-size: 0.78rem; }

    .post-header-right { display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0; }
    .tags-row { display: flex; gap: 0.4rem; flex-wrap: wrap; }
    .tag { padding: 0.25rem 0.65rem; background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2); color: #a78bfa; border-radius: 20px; font-size: 0.72rem; font-weight: 600; }

    /* Post Body */
    .post-body { margin-bottom: 1.25rem; }
    .post-text {
      color: #cbd5e1; font-size: 1rem; line-height: 1.75;
      display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;
      margin: 0;
    }
    .post-text.expanded { -webkit-line-clamp: unset; overflow: visible; }
    .btn-readmore { background: none; border: none; color: #6366f1; font-size: 0.875rem; font-weight: 600; cursor: pointer; padding: 0; margin-top: 0.5rem; }
    .btn-readmore:hover { color: #a78bfa; }

    /* Attachments */
    .post-attachments { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1rem; }
    .att-image-wrap { width: 140px; height: 100px; border-radius: 8px; overflow: hidden; border: 1px solid rgba(99,102,241,0.2); background: rgba(15,23,42,0.5); display: flex; align-items: center; justify-content: center; }
    .att-image { width: 100%; height: 100%; object-fit: cover; transition: opacity 0.2s; }
    .att-image:hover { opacity: 0.9; }
    .att-file-link { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.5rem 1rem; background: rgba(30,41,59,0.5); border: 1px solid rgba(99,102,241,0.2); border-radius: 8px; color: #a78bfa; font-size: 0.875rem; text-decoration: none; transition: all 0.15s; }
    .att-file-link:hover { background: rgba(99,102,241,0.1); border-color: #6366f1; color: #c4b5fd; }

    /* Post Footer */
    .post-footer { display: flex; align-items: center; gap: 0.75rem; padding-top: 1rem; border-top: 1px solid rgba(99,102,241,0.08); flex-wrap: wrap; }

    .vote-group { display: flex; align-items: center; background: rgba(30,41,59,0.6); border: 1px solid rgba(99,102,241,0.15); border-radius: 24px; overflow: hidden; }
    .vote-btn {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.5rem 1rem; background: none; border: none;
      color: #64748b; font-size: 0.875rem; font-weight: 600; cursor: pointer;
      transition: all 0.15s;
    }
    .vote-btn:hover { color: #e2e8f0; background: rgba(99,102,241,0.1); }
    .vote-btn.upvote.voted { color: #6366f1; }
    .vote-btn.upvote.voted svg { fill: #6366f1; }
    .vote-divider { width: 1px; height: 20px; background: rgba(99,102,241,0.15); }
    .vote-btn.downvote { padding: 0.5rem 0.75rem; }

    /* Action buttons */
    .action-btn {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.5rem 1rem; background: none;
      border: 1px solid rgba(99,102,241,0.15); border-radius: 24px;
      color: #64748b; font-size: 0.875rem; font-weight: 600;
      cursor: pointer; text-decoration: none; transition: all 0.15s;
    }
    .action-btn:hover { border-color: rgba(99,102,241,0.4); color: #e2e8f0; background: rgba(99,102,241,0.05); }
    .comments-btn { color: #64748b; }
    .comments-btn:hover { color: #60a5fa; border-color: rgba(96,165,250,0.3); }

    /* ── Edit Form ── */
    .edit-form { width: 100%; display: flex; flex-direction: column; gap: 0.75rem; }
    .edit-header { display: flex; justify-content: space-between; align-items: center; }
    .edit-label { color: #a78bfa; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    .edit-chars { color: #475569; font-size: 0.75rem; }
    .edit-textarea {
      width: 100%; box-sizing: border-box;
      background: rgba(30,41,59,0.6); border: 1px solid rgba(99,102,241,0.3);
      border-radius: 10px; color: #f1f5f9; padding: 1rem;
      font-size: 0.95rem; font-family: inherit; resize: vertical;
      outline: none; min-height: 120px; transition: border-color 0.2s;
    }
    .edit-textarea:focus { border-color: #6366f1; background: rgba(30,41,59,0.8); }
    .edit-tags-input {
      width: 100%; box-sizing: border-box;
      background: rgba(30,41,59,0.4); border: 1px solid rgba(99,102,241,0.15);
      border-radius: 8px; color: #94a3b8; padding: 0.65rem 1rem;
      font-size: 0.875rem; outline: none; transition: border-color 0.2s;
    }
    .edit-tags-input:focus { border-color: rgba(99,102,241,0.4); }
    .edit-footer { display: flex; justify-content: flex-end; gap: 0.75rem; }
    .btn-cancel { padding: 0.55rem 1.1rem; background: transparent; border: 1px solid rgba(99,102,241,0.2); color: #94a3b8; border-radius: 8px; cursor: pointer; font-size: 0.875rem; transition: all 0.15s; }
    .btn-cancel:hover { border-color: #6366f1; color: #a78bfa; }
    .btn-save { padding: 0.55rem 1.4rem; background: linear-gradient(135deg,#6366f1,#8b5cf6); color: white; border: none; border-radius: 8px; font-weight: 700; font-size: 0.875rem; cursor: pointer; box-shadow: 0 4px 12px rgba(99,102,241,0.3); transition: all 0.15s; }
    .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-save:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(99,102,241,0.4); }
  `]
})
export class DashboardPostsComponent implements OnInit {
  userPosts$: Observable<Post[]>;
  loading$: Observable<boolean>;
  currentUser$: Observable<AuthUser | null>;

  expandedPosts = new Set<string>();
  editForm: FormGroup;
  editingId = signal<string | null>(null);

  constructor(private store: Store, private fb: FormBuilder) {
    this.userPosts$ = this.store.select(selectUserPosts);
    this.loading$ = this.store.select(selectUserPostsLoading);
    this.currentUser$ = this.store.select(selectCurrentUser);
    this.editForm = this.fb.group({
      text: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(1000)]],
      tags: ['']
    });
  }

  ngOnInit(): void {
    this.store.select(selectCurrentUser).subscribe(user => {
      if (user?.id) this.store.dispatch(loadUserPosts({ userId: user.id }));
    });
  }

  startEdit(post: Post): void {
    this.editingId.set(post._id);
    this.editForm.patchValue({
      text: post.text,
      tags: post.tags?.join(', ') || ''
    });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.editForm.reset();
  }

  saveEdit(id: string): void {
    if (this.editForm.invalid) return;
    const { text, tags } = this.editForm.value;
    const tagsArr = tags ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [];
    this.store.dispatch(updatePost({ id, postData: { text, tags: tagsArr } }));
    this.cancelEdit();
  }

  onDelete(id: string): void {
    if (confirm('Delete this post? This cannot be undone.')) {
      this.store.dispatch(deletePost({ id }));
    }
  }

  toggleExpand(id: string) {
    if (this.expandedPosts.has(id)) {
      this.expandedPosts.delete(id);
    } else {
      this.expandedPosts.add(id);
    }
  }

  onLike(id: string) {
    this.store.dispatch(likePost({ id }));
  }

  onUnlike(id: string) {
    this.store.dispatch(unlikePost({ id }));
  }

  hasLiked(post: Post, user: AuthUser | null): boolean {
    if (!user) return false;
    return post.likes?.some(l => l.user === user.id) ?? false;
  }
}
