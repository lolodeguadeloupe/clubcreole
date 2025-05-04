-- Create client_reviews table
CREATE TABLE client_reviews (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    avatar_url TEXT NOT NULL,
    comment TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    date DATE NOT NULL,
    rental_company TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert initial data
INSERT INTO client_reviews (name, location, avatar_url, comment, rating, date, rental_company) VALUES
('Sophie Martin', 'Paris, France', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80', 'Service exceptionnel ! La voiture était impeccable et le prix avec la réduction Club Créole était vraiment avantageux. Je recommande vivement Caribbean Cars pour découvrir la Martinique.', 5, '2023-05-15', 'Caribbean Cars'),
('Thomas Dubois', 'Lyon, France', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80', 'Prestige Auto a rendu mon séjour inoubliable. J''ai pu profiter d''un cabriolet de luxe pour admirer les paysages martiniquais. Le jour de location offert grâce au Club Créole a été un vrai plus !', 5, '2023-06-03', 'Prestige Auto'),
('Marie Leroy', 'Bordeaux, France', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80', 'Très satisfaite de mon expérience avec Eco Drive. Louer un véhicule électrique était parfait pour explorer l''île tout en respectant l''environnement. Les recharges gratuites sont un vrai avantage.', 4, '2023-07-22', 'Eco Drive'),
('Jean Moreau', 'Marseille, France', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80', 'Aventure 4x4 a dépassé toutes mes attentes ! Le SUV était parfaitement adapté aux routes plus difficiles de la Martinique. Le kit d''aventure offert était vraiment utile pour nos excursions.', 5, '2023-08-10', 'Aventure 4x4'),
('Claire Petit', 'Nantes, France', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80', 'Service client exceptionnel chez Caribbean Cars. Ils ont été très réactifs quand j''ai eu un petit problème et l''ont résolu immédiatement. La réduction Club Créole était substantielle !', 5, '2023-09-05', 'Caribbean Cars');

-- Create updated_at trigger
CREATE TRIGGER update_client_reviews_updated_at
    BEFORE UPDATE ON client_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE client_reviews ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Enable read access for all users" ON client_reviews
    FOR SELECT
    TO public
    USING (true); 