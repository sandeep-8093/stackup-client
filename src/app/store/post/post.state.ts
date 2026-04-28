export interface Attachment {
  url: string;
  publicId?: string;
  resourceType?: string; // 'image' | 'raw'
  originalName?: string;
  size?: number;
  format?: string;
}

export interface Comment {
  _id?: string;
  user?: string;
  text: string;
  name?: string;
  avatar?: string;
  createdAt?: string;
}

export interface Post {
  _id: string;
  user?: string;
  text: string;
  name?: string;
  avatar?: string;
  tags?: string[];
  likes?: { user: string }[];
  comments?: Comment[];
  views?: number;
  attachments?: Attachment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PostState {
  posts: Post[];
  userPosts: Post[];
  post: Post | null;
  loading: boolean;
  userPostsLoading: boolean;
  error: string | null;
}

export const initialPostState: PostState = {
  posts: [],
  userPosts: [],
  post: null,
  loading: false,
  userPostsLoading: false,
  error: null,
};
