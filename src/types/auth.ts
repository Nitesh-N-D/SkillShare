export type SkillLevel = 'Beginner'|'Intermediate'|'Advacned'|'Expert'

export interface UserProfile{
    uid : string;
    email : string | null;
    displayName : string | null;
    photoURl : string | null;
    skillLevel : SkillLevel;
    interests: string[];
    createdAt : string;
    lastUpdated : string;
}

export interface User{
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  createdAt?: string;
  lastSignIn?: string;
  skillLevel?:SkillLevel;
  interests?: string[]
}

export interface AuthState{
    user : User|null;
    loading : boolean;
    error : string | null;
}

export interface AuthError{
    code : string;
    message : string;
    timestamp : number;
}

export interface SignInResult{
    success : boolean;
    user : User | null;
    error : AuthError | null;
}
