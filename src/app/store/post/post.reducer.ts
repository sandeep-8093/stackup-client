import { createReducer, on } from '@ngrx/store';
import { initialPostState } from './post.state';
import * as PostActions from './post.actions';

export const postReducer = createReducer(
  initialPostState,
  on(PostActions.loadPosts, PostActions.loadPost, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(PostActions.loadPostsSuccess, PostActions.likeUnlikeSuccess, (state, { posts }) => ({
    ...state,
    posts,
    loading: false,
  })),
  on(PostActions.loadUserPosts, (state) => ({
    ...state,
    userPostsLoading: true,
  })),
  on(PostActions.loadUserPostsSuccess, (state, { posts }) => ({
    ...state,
    userPosts: posts,
    userPostsLoading: false,
  })),
  on(PostActions.loadUserPostsFailure, (state, { error }) => ({
    ...state,
    userPostsLoading: false,
    error,
  })),
  on(PostActions.updatePostInList, (state, { post }) => ({
    ...state,
    posts: state.posts.map(p => p._id === post._id ? post : p),
    userPosts: state.userPosts.map(p => p._id === post._id ? post : p),
    // Also update the single post view if we're on that page
    post: state.post?._id === post._id ? post : state.post,
  })),
  on(PostActions.loadPostSuccess, PostActions.addCommentSuccess, PostActions.deleteCommentSuccess, (state, { post }) => ({
    ...state,
    post,
    loading: false,
  })),
  on(PostActions.loadPostsFailure, PostActions.loadPostFailure, PostActions.createPostFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(PostActions.createPostSuccess, (state, { post }) => ({
    ...state,
    posts: [post, ...state.posts],
    userPosts: [post, ...state.userPosts],
    loading: false,
  })),
  on(PostActions.deletePostSuccess, (state, { id }) => ({
    ...state,
    posts: state.posts.filter(p => p._id !== id),
    userPosts: state.userPosts.filter(p => p._id !== id),
  })),
  on(PostActions.updatePostSuccess, (state, { post }) => ({
    ...state,
    posts: state.posts.map(p => p._id === post._id ? post : p),
    userPosts: state.userPosts.map(p => p._id === post._id ? post : p),
    post: state.post?._id === post._id ? post : state.post,
    loading: false,
  }))
);
