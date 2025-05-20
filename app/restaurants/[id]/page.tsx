import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface RestaurantPageProps {
  params: {
    id: string
  }
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: restaurant, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !restaurant) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{restaurant.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Description</h3>
              <p className="text-gray-600">{restaurant.description}</p>
            </div>
            <div>
              <h3 className="font-semibold">Adresse</h3>
              <p className="text-gray-600">{restaurant.address}</p>
            </div>
            <div>
              <h3 className="font-semibold">Horaires</h3>
              <p className="text-gray-600">{restaurant.opening_hours}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 