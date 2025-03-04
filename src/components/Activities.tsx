
import { Coffee, Bed, Music, Martini, Car, Gamepad2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const activities = [
  { icon: Gamepad2, name: "Loisirs", path: "/loisirs" },
  { icon: Coffee, name: "Restauration", path: "/restauration" },
  { icon: Bed, name: "Hébergements", path: "/hebergements" },
  { icon: Music, name: "Concerts", path: "/concerts" },
  { icon: Martini, name: "Soirée", path: "/soiree" },
  { icon: Car, name: "Location de Voitures", path: "/location" },
];

export const Activities = () => {
  const navigate = useNavigate();

  return (
    <section id="activities" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-creole-blue mb-12">
          Nos Activités
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate(activity.path)}
            >
              <activity.icon className="h-12 w-12 text-creole-green mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">{activity.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Activities;
