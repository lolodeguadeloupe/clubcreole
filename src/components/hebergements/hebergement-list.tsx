"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Hebergement } from '@/types/hebergement';

export default function HebergementList({ hebergements }: { hebergements: Hebergement[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hebergements.map((hebergement) => (
        <Card key={hebergement.id} className="overflow-hidden">
          <div className="relative h-48">
            <img
              src={hebergement.image}
              alt={hebergement.name}
              className="w-full h-full object-cover"
            />
          </div>
          <CardHeader>
            <CardTitle>{hebergement.name}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              {hebergement.rating} • {hebergement.type} • {hebergement.location}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">{hebergement.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {hebergement.features.map((feature, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                >
                  {feature}
                </span>
              ))}
            </div>
            <p className="text-lg font-semibold text-primary">
              {hebergement.price}€ / nuit
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 