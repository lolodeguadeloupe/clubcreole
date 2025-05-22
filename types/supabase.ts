export interface Restaurant {
  id: string
  name: string
  description: string
  address: string
  opening_hours: string
  created_at: string
  updated_at: string
}

export type Database = {
  public: {
    Tables: {
      restaurants: {
        Row: Restaurant
        Insert: Omit<Restaurant, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Restaurant, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
} 