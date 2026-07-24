export interface User {
  id: number;
  username: string;
  email: string;
  role?: string;
  organization?: number | null;
  organization_name?: string | null;
}

export interface LoginResponse {
  user: User;
  access: string;
  refresh: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
  organization_name?: string;
}

