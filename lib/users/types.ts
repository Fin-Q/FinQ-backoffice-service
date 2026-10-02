export type BackofficeUser = {
  id: number;
  nickname: string;
  email: string | null;
  onboardingStatus: string;
  totalXp: number;
  currentStreak: number;
  createdAt: string;
  lastLoginAt: string | null;
};

export type BackofficeUserPage = {
  users: BackofficeUser[];
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
};
