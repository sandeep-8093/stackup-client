import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PostState } from './post.state';

export const selectPostState = createFeatureSelector<PostState>('post');

export const selectPosts = createSelector(selectPostState, s => s.posts);
export const selectUserPosts = createSelector(selectPostState, s => s.userPosts);
export const selectPost = createSelector(selectPostState, s => s.post);
export const selectPostLoading = createSelector(selectPostState, s => s.loading);
export const selectUserPostsLoading = createSelector(selectPostState, s => s.userPostsLoading);
export const selectPostError = createSelector(selectPostState, s => s.error);
