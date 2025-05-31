export type User = {
  id: string;
  email: string;
  email_verified: boolean;
  subscriptionStatus: 'pending' | 'trial' | 'active' | 'expired';
  trialStartDate: string | null;
  niches: string[];
  createdAt: string;
};

export type Digest = {
  id: string;
  userId: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  topics: string[];
};

export type Niche = {
  id: string;
  name: string;
  description: string;
  icon: string;
};