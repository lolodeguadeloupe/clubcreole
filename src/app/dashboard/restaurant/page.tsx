import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { RestaurantDashboard } from "@/components/dashboard/RestaurantDashboard";

export default async function RestaurantDashboardPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // Vérifier si l'utilisateur est un restaurateur
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (profile?.role !== "partner") {
    redirect("/dashboard");
  }

  // Récupérer les restaurants du restaurateur
  const { data: restaurantOwners } = await supabase
    .from("restaurant_owners")
    .select("restaurant_id")
    .eq("user_id", session.user.id);

  const restaurantIds = restaurantOwners?.map((ro) => ro.restaurant_id) || [];

  const { data: restaurants } = await supabase
    .from("restaurants")
    .select("*")
    .in("id", restaurantIds);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord Restaurateur</h1>
      <RestaurantDashboard restaurants={restaurants || []} />
    </div>
  );
} 