export type UserRole = 'admin' | 'client' | 'partner';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  companyName?: string; // Pour les partenaires
  createdAt: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalPartners: number;
  totalClients: number;
  totalActivities: number;
  totalBookings: number;
  revenue: number;
  recentActivities: Array<{
    date: string;
    count: number;
    revenue: number;
  }>;
}

export interface ClientDashboardStats {
  upcomingBookings: Array<{
    id: string;
    activityName: string;
    date: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    price: number;
  }>;
  pastBookings: Array<{
    id: string;
    activityName: string;
    date: string;
    status: 'completed' | 'cancelled';
    price: number;
  }>;
  favoriteActivities: Array<{
    id: string;
    name: string;
    category: string;
  }>;
}

export interface PartnerDashboardStats {
  totalActivities: number;
  totalBookings: number;
  revenue: number;
  upcomingBookings: Array<{
    id: string;
    activityName: string;
    date: string;
    clientName: string;
    status: 'pending' | 'confirmed';
    price: number;
  }>;
  activityStats: Array<{
    activityId: string;
    activityName: string;
    totalBookings: number;
    revenue: number;
  }>;
} 