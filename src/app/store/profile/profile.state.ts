export interface Experience {
  _id?: string;
  title: string;
  company: string;
  location?: string;
  from?: string;
  to?: string;
  current?: boolean;
  description?: string;
}

export interface Education {
  _id?: string;
  school: string;
  degree: string;
  fieldofstudy: string;
  from?: string;
  to?: string;
  current?: boolean;
  description?: string;
}

export interface Social {
  youtube?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
}

export interface Profile {
  _id?: string;
  user?: { _id: string; name: string; avatar?: string };
  handle: string;
  company?: string;
  website?: string;
  location?: string;
  status: string;
  skills: string[];
  bio?: string;
  githubusername?: string;
  yearsOfExperience?: number;
  interests?: string[];
  resumeLink?: string;
  languages?: string[];
  experience: Experience[];
  education: Education[];
  social?: Social;
}

export interface ProfileState {
  profile: Profile | null;
  profiles: Profile[];
  loading: boolean;
  error: string | null;
}

export const initialProfileState: ProfileState = {
  profile: null,
  profiles: [],
  loading: false,
  error: null,
};
