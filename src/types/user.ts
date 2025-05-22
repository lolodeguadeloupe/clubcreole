export type UserRole = 'admin' | 'partner' | 'client';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalPartners: number;
  totalClients: number;
  totalRestaurants: number;
  totalActivities: number;
  totalBookings: number;
  totalRevenue: number;
  recentActivities: Array<{
    date: string;
    revenue: number;
    count: number;
  }>;
}

export interface Partner {
  id: string;
  name: string;
  type: 'restaurant' | 'hotel' | 'activity' | 'other';
  status: 'active' | 'pending' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  type: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
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

export type Advantage = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}; 