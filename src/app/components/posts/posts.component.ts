import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loadPosts, createPost, likePost, unlikePost, deletePost } from '../../store/post/post.actions';
import { selectPosts, selectPostLoading } from '../../store/post/post.selectors';
import { selectCurrentUser, selectIsAuthenticated } from '../../store/auth/auth.selectors';
import { Post } from '../../store/post/post.state';
import { AuthUser } from '../../store/auth/auth.state';
import { SpinnerComponent } from '../shared/spinner/spinner.component';

const TOPICS = ['All', 'JavaScript', 'Angular', 'React', 'Python', 'Node.js', 'TypeScript', 'DevOps', 'AI/ML', 'Career'];

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, SpinnerComponent],
  template: `
    <div class="feed-layout">

      <!-- ─── LEFT SIDEBAR ─────────────────────────────────── -->
      <aside class="sidebar-left">
        <div class="sidebar-section">
          <p class="sidebar-label">Topics</p>
          <ul class="topic-list">
            <li *ngFor="let topic of topics"
                [class.active]="activeTopic() === topic"
                (click)="setTopic(topic)">
              <span class="topic-dot"></span> {{ topic }}
            </li>
          </ul>
        </div>

        <div class="sidebar-section">
          <p class="sidebar-label">More</p>
          <ul class="topic-list">
            <li><span>📖</span> About StackUp</li>
            <li><span>🔒</span> Privacy Policy</li>
            <li><span>📋</span> Terms of Service</li>
          </ul>
        </div>
      </aside>

      <!-- ─── MAIN FEED ─────────────────────────────────────── -->
      <main class="feed-main">

        <!-- Search + Filter Bar -->
        <div class="feed-topbar">
          <div class="search-bar">
            <span class="search-icon">🔍</span>
            <input type="text" placeholder="Search posts..." (input)="onSearch($event)" />
          </div>
          <div class="topic-pills">
            <button *ngFor="let topic of topics.slice(0,5)"
                    [class.active]="activeTopic() === topic"
                    (click)="setTopic(topic)" class="pill">
              {{ topic }}
            </button>
          </div>
        </div>

        <!-- Write a Post Card -->
        <div class="write-card" *ngIf="isAuthenticated$ | async">
          <div class="write-trigger" *ngIf="!showForm()" (click)="openForm()">
            <div class="write-avatar">✍️</div>
            <span class="write-placeholder">What's on your developer mind?</span>
            <button class="btn-add-post">Post</button>
          </div>

          <div class="write-expanded" *ngIf="showForm()">
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="write-tabs">
                <button type="button" class="tab active">📝 Post</button>
              </div>
              <textarea
                formControlName="text"
                placeholder="Share knowledge, ask a question, or start a discussion..."
                rows="5"
                (keydown.escape)="closeForm()"
                autofocus>
              </textarea>
              <div class="write-meta">
                <input type="text" formControlName="tags" placeholder="Add tags: Angular, TypeScript... (comma-separated)" class="tags-input"/>
              </div>

              <!-- File Previews -->
              <div class="file-previews" *ngIf="selectedFiles.length > 0">
                <div class="file-preview-item" *ngFor="let f of selectedFiles; let i = index">
                  <ng-container *ngIf="isImage(f)">
                    <img [src]="previewUrls[i]" [alt]="f.name" class="preview-thumb"/>
                  </ng-container>
                  <ng-container *ngIf="!isImage(f)">
                    <div class="file-icon">📄</div>
                  </ng-container>
                  <span class="file-name">{{ f.name }}</span>
                  <button type="button" class="remove-file" (click)="removeFile(i)">✕</button>
                </div>
              </div>

              <div class="write-footer">
                <!-- Hidden file input -->
                <input #fileInput type="file" multiple accept="image/*,.pdf,.doc,.docx,.zip"
                       style="display:none" (change)="onFilesSelected($event)"/>
                <button type="button" class="btn-attach" (click)="fileInput.click()"
                        title="Attach files (max 3, 10 MB each)">
                  📎 {{ selectedFiles.length > 0 ? selectedFiles.length + ' file(s)' : 'Attach' }}
                </button>
                <button type="button" class="btn-cancel" (click)="closeForm()">Cancel</button>
                <button type="submit" class="btn-post" [disabled]="form.get('text')?.invalid">Publish Post</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Spinner -->
        <app-spinner *ngIf="loading$ | async"></app-spinner>

        <!-- Posts Feed -->
        <div class="posts-feed" *ngIf="!(loading$ | async)">

          <div class="empty-feed" *ngIf="!(posts$ | async)?.length">
            <div class="empty-icon">📭</div>
            <h3>No posts yet</h3>
            <p>Be the first to share something with the community!</p>
          </div>

          <article class="post-card" *ngFor="let post of (posts$ | async); trackBy: trackById">

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
                <button *ngIf="(currentUser$ | async)?.id === post.user"
                        class="btn-delete-post" (click)="onDelete(post._id)" title="Delete post">✕</button>
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

              <button class="action-btn share-btn" (click)="onShare(post._id)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                </svg>
                Share
              </button>

              <button class="action-btn more-btn" title="More options">•••</button>
            </div>

          </article>
        </div>
      </main>

      <!-- ─── RIGHT SIDEBAR ──────────────────────────────────── -->
      <aside class="sidebar-right">
        <div class="sidebar-widget">
          <h3 class="widget-title">🔥 Trending</h3>
          <ul class="trending-list">
            <li *ngFor="let tag of trendingTags">
              <span class="trending-tag">{{ tag.name }}</span>
              <span class="trending-count">{{ tag.count }} posts</span>
            </li>
          </ul>
        </div>

        <div class="sidebar-widget">
          <h3 class="widget-title">💡 Posting Tips</h3>
          <ul class="tips-list">
            <li>Share your experience with specific tech</li>
            <li>Add tags to reach the right readers</li>
            <li>Ask questions to spark discussion</li>
            <li>Upvote posts you find helpful</li>
          </ul>
        </div>

        <div class="sidebar-widget compact">
          <p class="footer-links">
            <a href="#">About</a> · <a href="#">Privacy</a> · <a href="#">Terms</a>
          </p>
          <p class="footer-copy">© {{ year }} StackUp</p>
        </div>
      </aside>

    </div>
  `,
  styles: [`
    /* ── Layout ────────────────────────────────────────────── */
    .feed-layout {
      display: grid;
      grid-template-columns: 220px 1fr 280px;
      gap: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
      align-items: start;
    }
    @media (max-width: 1024px) { .feed-layout { grid-template-columns: 200px 1fr; } .sidebar-right { display: none; } }
    @media (max-width: 700px)  { .feed-layout { grid-template-columns: 1fr; } .sidebar-left { display: none; } }

    /* ── Left Sidebar ───────────────────────────────────────── */
    .sidebar-left { position: sticky; top: 80px; }
    .sidebar-section { margin-bottom: 2rem; }
    .sidebar-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #475569; margin-bottom: 0.75rem; padding-left: 0.5rem; }
    .topic-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 2px; }
    .topic-list li {
      display: flex; align-items: center; gap: 0.75rem;
      padding: 0.55rem 0.75rem; border-radius: 8px;
      color: #94a3b8; font-size: 0.9rem; cursor: pointer;
      transition: all 0.15s;
    }
    .topic-list li:hover { background: rgba(99,102,241,0.1); color: #e2e8f0; }
    .topic-list li.active { background: rgba(99,102,241,0.15); color: #a78bfa; font-weight: 600; }
    .topic-dot { width: 8px; height: 8px; border-radius: 50%; background: #6366f1; flex-shrink: 0; }

    /* ── Top Bar ────────────────────────────────────────────── */
    .feed-topbar { margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; }
    .search-bar {
      display: flex; align-items: center; gap: 0.75rem;
      background: rgba(15,23,42,0.8); border: 1px solid rgba(99,102,241,0.2);
      border-radius: 30px; padding: 0.6rem 1.2rem;
    }
    .search-icon { font-size: 1rem; color: #64748b; }
    .search-bar input { background: none; border: none; outline: none; color: #e2e8f0; font-size: 0.95rem; width: 100%; }
    .search-bar input::placeholder { color: #475569; }
    .topic-pills { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .pill {
      padding: 0.35rem 1rem; border-radius: 20px; border: 1px solid rgba(99,102,241,0.2);
      background: transparent; color: #94a3b8; font-size: 0.8rem; cursor: pointer; transition: all 0.15s;
    }
    .pill:hover { border-color: #6366f1; color: #a78bfa; }
    .pill.active { background: rgba(99,102,241,0.15); border-color: #6366f1; color: #a78bfa; font-weight: 600; }

    /* ── Write Card ─────────────────────────────────────────── */
    .write-card {
      background: rgba(15,23,42,0.85); border: 1px solid rgba(99,102,241,0.2);
      border-radius: 12px; margin-bottom: 1.25rem; overflow: hidden;
      backdrop-filter: blur(12px);
    }
    .write-trigger { display: flex; align-items: center; gap: 1rem; padding: 1.1rem 1.5rem; cursor: pointer; }
    .write-trigger:hover { background: rgba(99,102,241,0.05); }
    .write-avatar { width: 40px; height: 40px; border-radius: 50%; background: rgba(99,102,241,0.2); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
    .write-placeholder { flex: 1; color: #475569; font-size: 0.95rem; }
    .btn-add-post { padding: 0.45rem 1.2rem; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border: none; border-radius: 20px; font-weight: 600; font-size: 0.85rem; cursor: pointer; }

    .write-expanded { padding: 1.5rem; }
    .write-tabs { display: flex; gap: 1rem; margin-bottom: 1rem; border-bottom: 1px solid rgba(99,102,241,0.1); padding-bottom: 0.75rem; }
    .tab { background: none; border: none; color: #64748b; cursor: pointer; font-size: 0.9rem; font-weight: 600; padding: 0 0.25rem 0.5rem; border-bottom: 2px solid transparent; margin-bottom: -0.75rem; }
    .tab.active { color: #a78bfa; border-bottom-color: #6366f1; }

    textarea {
      width: 100%; box-sizing: border-box; background: rgba(30,41,59,0.4);
      border: 1px solid rgba(99,102,241,0.15); border-radius: 8px;
      color: #f1f5f9; padding: 1rem; font-size: 1rem;
      resize: vertical; outline: none; font-family: inherit; min-height: 120px;
      transition: border-color 0.2s;
    }
    textarea:focus { border-color: #6366f1; background: rgba(30,41,59,0.7); }
    .write-meta { margin-top: 0.75rem; }
    .tags-input {
      width: 100%; box-sizing: border-box; background: rgba(30,41,59,0.3);
      border: 1px solid rgba(99,102,241,0.1); border-radius: 8px;
      color: #94a3b8; padding: 0.6rem 1rem; font-size: 0.875rem; outline: none;
    }
    .tags-input:focus { border-color: rgba(99,102,241,0.4); }
    .write-footer { display: flex; align-items: center; gap: 0.75rem; margin-top: 1rem; }
    .btn-attach { padding: 0.5rem 1rem; background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2); color: #a78bfa; border-radius: 8px; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: all 0.15s; margin-right: auto; }
    .btn-attach:hover { background: rgba(99,102,241,0.2); border-color: #6366f1; }
    .btn-cancel { padding: 0.55rem 1.2rem; background: transparent; border: 1px solid rgba(99,102,241,0.2); color: #94a3b8; border-radius: 8px; cursor: pointer; font-size: 0.9rem; }
    .btn-cancel:hover { border-color: #6366f1; color: #a78bfa; }
    .btn-post { padding: 0.55rem 1.5rem; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border: none; border-radius: 8px; font-weight: 700; font-size: 0.9rem; cursor: pointer; box-shadow: 0 4px 12px rgba(99,102,241,0.3); }
    .btn-post:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-post:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(99,102,241,0.4); }

    /* File Previews */
    .file-previews { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 0.75rem; padding: 0.75rem; background: rgba(30,41,59,0.3); border-radius: 8px; border: 1px dashed rgba(99,102,241,0.2); }
    .file-preview-item { display: flex; align-items: center; gap: 0.5rem; background: rgba(15,23,42,0.6); border: 1px solid rgba(99,102,241,0.15); border-radius: 8px; padding: 0.4rem 0.6rem; max-width: 200px; }
    .preview-thumb { width: 40px; height: 40px; object-fit: cover; border-radius: 4px; flex-shrink: 0; }
    .file-icon { font-size: 1.5rem; flex-shrink: 0; }
    .file-name { color: #94a3b8; font-size: 0.75rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
    .remove-file { background: none; border: none; color: #f87171; cursor: pointer; font-size: 0.85rem; padding: 0 0.2rem; flex-shrink: 0; }
    .remove-file:hover { color: #ef4444; }

    /* Post Attachments */
    .post-attachments { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1rem; }
    .att-image-wrap { display: block; border-radius: 8px; overflow: hidden; border: 1px solid rgba(99,102,241,0.2); max-width: 100%; }
    .att-image { display: block; max-width: 100%; max-height: 400px; object-fit: cover; border-radius: 8px; transition: opacity 0.2s; }
    .att-image:hover { opacity: 0.9; }
    .att-file-link { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.5rem 1rem; background: rgba(30,41,59,0.5); border: 1px solid rgba(99,102,241,0.2); border-radius: 8px; color: #a78bfa; font-size: 0.875rem; text-decoration: none; transition: all 0.15s; }
    .att-file-link:hover { background: rgba(99,102,241,0.1); border-color: #6366f1; color: #c4b5fd; }

    /* ── Post Cards ─────────────────────────────────────────── */
    .posts-feed { display: flex; flex-direction: column; gap: 0; }
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
    .btn-delete-post { background: none; border: none; color: #475569; cursor: pointer; font-size: 1rem; padding: 0.25rem 0.4rem; border-radius: 4px; transition: color 0.15s; }
    .btn-delete-post:hover { color: #f87171; }

    /* Post Body */
    .post-body { margin-bottom: 1.25rem; }
    .post-text {
      color: #cbd5e1; font-size: 1rem; line-height: 1.75;
      display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;
    }
    .post-text.expanded { -webkit-line-clamp: unset; overflow: visible; }
    .btn-readmore { background: none; border: none; color: #6366f1; font-size: 0.875rem; font-weight: 600; cursor: pointer; padding: 0; margin-top: 0.5rem; }
    .btn-readmore:hover { color: #a78bfa; }

    /* Post Footer */
    .post-footer { display: flex; align-items: center; gap: 0.75rem; padding-top: 1rem; border-top: 1px solid rgba(99,102,241,0.08); }

    /* Vote group */
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
    .more-btn { margin-left: auto; padding: 0.5rem 0.6rem; letter-spacing: 0.05em; }

    /* Empty state */
    .empty-feed { text-align: center; padding: 5rem 2rem; }
    .empty-icon { font-size: 4rem; margin-bottom: 1rem; }
    .empty-feed h3 { color: #e2e8f0; font-size: 1.4rem; margin-bottom: 0.5rem; }
    .empty-feed p { color: #64748b; }

    /* ── Right Sidebar ───────────────────────────────────────── */
    .sidebar-right { position: sticky; top: 80px; display: flex; flex-direction: column; gap: 1.25rem; }
    .sidebar-widget {
      background: rgba(15,23,42,0.8); border: 1px solid rgba(99,102,241,0.15);
      border-radius: 12px; padding: 1.25rem;
    }
    .widget-title { color: #e2e8f0; font-size: 0.95rem; font-weight: 700; margin-bottom: 1rem; }
    .trending-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem; }
    .trending-list li { display: flex; justify-content: space-between; align-items: center; }
    .trending-tag { color: #a78bfa; font-size: 0.875rem; font-weight: 600; }
    .trending-count { color: #475569; font-size: 0.75rem; }
    .tips-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.6rem; }
    .tips-list li { color: #64748b; font-size: 0.825rem; line-height: 1.5; padding-left: 0.75rem; border-left: 2px solid rgba(99,102,241,0.3); }
    .sidebar-widget.compact { padding: 1rem; }
    .footer-links { color: #334155; font-size: 0.75rem; margin-bottom: 0.25rem; }
    .footer-links a { color: #475569; text-decoration: none; }
    .footer-links a:hover { color: #94a3b8; }
    .footer-copy { color: #1e293b; font-size: 0.7rem; margin: 0; }
  `]
})
export class PostsComponent implements OnInit {
  form: FormGroup;
  posts$: Observable<Post[]>;
  loading$: Observable<boolean>;
  currentUser$: Observable<AuthUser | null>;
  isAuthenticated$: Observable<boolean>;

  topics = TOPICS;
  activeTopic = signal('All');
  showForm = signal(false);
  expandedPosts = new Set<string>();
  year = new Date().getFullYear();

  // File attachment state
  selectedFiles: File[] = [];
  previewUrls: string[] = [];

  trendingTags = [
    { name: '#Angular', count: 124 },
    { name: '#TypeScript', count: 98 },
    { name: '#NodeJS', count: 76 },
    { name: '#WebDev', count: 65 },
    { name: '#CareerAdvice', count: 42 },
  ];

  constructor(private fb: FormBuilder, private store: Store, private route: ActivatedRoute) {
    this.form = this.fb.group({
      text: ['', [Validators.required, Validators.minLength(3)]],
      tags: ['']
    });
    this.posts$ = this.store.select(selectPosts);
    this.loading$ = this.store.select(selectPostLoading);
    this.currentUser$ = this.store.select(selectCurrentUser);
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
  }

  ngOnInit() {
    // Pick up ?search= from URL (e.g. from navbar global search)
    const q = this.route.snapshot.queryParamMap.get('search');
    if (q) {
      this.store.dispatch(loadPosts({ search: q }));
    } else {
      this.store.dispatch(loadPosts({}));
    }
  }

  openForm()  { this.showForm.set(true); }
  closeForm() {
    this.showForm.set(false);
    this.form.reset();
    this.clearFiles();
  }

  setTopic(topic: string) {
    this.activeTopic.set(topic);
    const search = topic === 'All' ? undefined : topic;
    this.store.dispatch(loadPosts({ search }));
  }

  onSearch(event: Event) {
    const val = (event.target as HTMLInputElement).value.trim();
    this.store.dispatch(loadPosts({ search: val || undefined }));
  }

  onSubmit() {
    if (this.form.invalid) return;
    const { text, tags } = this.form.value;
    const tagsArr = tags ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [];
    this.store.dispatch(createPost({ postData: { text, tags: tagsArr, files: this.selectedFiles } }));
    this.closeForm();
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    const newFiles = Array.from(input.files);
    const combined = [...this.selectedFiles, ...newFiles].slice(0, 3); // max 3
    combined.forEach((f, i) => {
      if (!this.previewUrls[i]) {
        const reader = new FileReader();
        reader.onload = e => { this.previewUrls[i] = e.target?.result as string; };
        reader.readAsDataURL(f);
      }
    });
    this.selectedFiles = combined;
    input.value = ''; // reset so same file can be picked again
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  clearFiles() {
    this.selectedFiles = [];
    this.previewUrls = [];
  }

  isImage(file: File): boolean {
    return file.type.startsWith('image/');
  }

  onLike(id: string)   { this.store.dispatch(likePost({ id })); }
  onUnlike(id: string) { this.store.dispatch(unlikePost({ id })); }
  onDelete(id: string) {
    if (confirm('Delete this post?')) this.store.dispatch(deletePost({ id }));
  }

  onShare(id: string) {
    const url = `${window.location.origin}/post/${id}`;
    navigator.clipboard?.writeText(url).then(() => alert('Link copied to clipboard!'));
  }

  toggleExpand(id: string) {
    if (this.expandedPosts.has(id)) this.expandedPosts.delete(id);
    else this.expandedPosts.add(id);
  }

  hasLiked(post: Post, user: AuthUser | null): boolean {
    if (!user) return false;
    return post.likes?.some(l => l.user === user.id) ?? false;
  }

  trackById(_: number, post: Post) { return post._id; }
}
