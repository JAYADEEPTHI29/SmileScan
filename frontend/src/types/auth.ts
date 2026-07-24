export type UserRole = 'DOCTOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  hospital: string;
  department: string;
  experienceYears: number;
  specialization: string;
  photoUrl?: string;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}
