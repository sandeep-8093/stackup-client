import { createAction, props } from '@ngrx/store';
import { Post } from './post.state';

// Load all posts
export const loadPosts = createAction(
  '[Post] Load Posts',
  props<{ search?: string }>()
);
export const loadPostsSuccess = createAction(
  '[Post] Load Posts Success',
  props<{ posts: Post[] }>()
);
export const loadPostsFailure = createAction(
  '[Post] Load Posts Failure',
  props<{ error: string }>()
);

// Load user specific posts
export const loadUserPosts = createAction(
  '[Post] Load User Posts',
  props<{ userId: string }>()
);
export const loadUserPostsSuccess = createAction(
  '[Post] Load User Posts Success',
  props<{ posts: Post[] }>()
);
export const loadUserPostsFailure = createAction(
  '[Post] Load User Posts Failure',
  props<{ error: string }>()
);

// Load single post
export const loadPost = createAction('[Post] Load Post', props<{ id: string }>());
export const loadPostSuccess = createAction(
  '[Post] Load Post Success',
  props<{ post: Post }>()
);
export const loadPostFailure = createAction(
  '[Post] Load Post Failure',
  props<{ error: string }>()
);

// Create post
export const createPost = createAction(
  '[Post] Create Post',
  props<{ postData: { text: string; tags?: string[]; files?: File[] } }>()
);
export const createPostSuccess = createAction(
  '[Post] Create Post Success',
  props<{ post: Post }>()
);
export const createPostFailure = createAction(
  '[Post] Create Post Failure',
  props<{ error: string }>()
);

// Delete post
export const deletePost = createAction('[Post] Delete Post', props<{ id: string }>());
export const deletePostSuccess = createAction(
  '[Post] Delete Post Success',
  props<{ id: string }>()
);

// Update / Edit post
export const updatePost = createAction(
  '[Post] Update Post',
  props<{ id: string; postData: { text: string; tags?: string[] } }>()
);
export const updatePostSuccess = createAction(
  '[Post] Update Post Success',
  props<{ post: Post }>()
);
export const updatePostFailure = createAction(
  '[Post] Update Post Failure',
  props<{ error: string }>()
);

// Like / Unlike
export const likePost = createAction('[Post] Like Post', props<{ id: string }>());
export const unlikePost = createAction('[Post] Unlike Post', props<{ id: string }>());
export const likeUnlikeSuccess = createAction(
  '[Post] Like/Unlike Success',
  props<{ posts: Post[] }>()
);
// Update a single post in the list (used by like/unlike)
export const updatePostInList = createAction(
  '[Post] Update Post In List',
  props<{ post: Post }>()
);

// Add comment
export const addComment = createAction(
  '[Post] Add Comment',
  props<{ postId: string; text: string }>()
);
export const addCommentSuccess = createAction(
  '[Post] Add Comment Success',
  props<{ post: Post }>()
);

// Delete comment
export const deleteComment = createAction(
  '[Post] Delete Comment',
  props<{ postId: string; commentId: string }>()
);
export const deleteCommentSuccess = createAction(
  '[Post] Delete Comment Success',
  props<{ post: Post }>()
);
