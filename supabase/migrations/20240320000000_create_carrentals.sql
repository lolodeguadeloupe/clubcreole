-- Create carrentals table
CREATE TABLE carrentals (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    image_url TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    rating DECIMAL(2,1) NOT NULL,
    offer TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert initial data
INSERT INTO carrentals (name, type, image_url, location, description, rating, offer) VALUES
('Caribbean Cars', 'Véhicules économiques', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 'Fort-de-France', 'Une large gamme de véhicules économiques et compacts, parfaits pour explorer l''île. Service client réactif et tarifs compétitifs.', 4.6, '15% de réduction sur toutes les locations de plus de 3 jours pour les membres du Club Créole'),
('Prestige Auto', 'Véhicules de luxe', 'https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 'Les Trois-Îlets', 'Louez des voitures de luxe et profitez d''un service premium. Notre flotte comprend des SUV haut de gamme, des cabriolets et des berlines de luxe.', 4.8, 'Un jour de location offert pour toute réservation d''une semaine ou plus'),
('Eco Drive', 'Véhicules électriques', 'https://images.unsplash.com/photo-1593941707882-a5bfb1050f50?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 'Le Lamentin', 'Louez des véhicules 100% électriques pour une expérience écologique. Contribuez à préserver la beauté naturelle des Antilles tout en explorant l''île.', 4.5, 'Recharge gratuite et 10% de réduction pour les membres du Club Créole'),
('Aventure 4x4', 'Véhicules tout-terrain', 'https://images.unsplash.com/photo-1533743410561-5c70e1a14cc1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 'Sainte-Anne', 'Spécialiste des 4x4 et SUV pour explorer les zones moins accessibles. Idéal pour les aventuriers souhaitant découvrir les trésors cachés de l''île.', 4.7, 'Kit d''aventure offert (GPS, glacière, guides) pour toute location 4x4 de 3 jours ou plus');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_carrentals_updated_at
    BEFORE UPDATE ON carrentals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE carrentals ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Enable read access for all users" ON carrentals
    FOR SELECT
    TO public
    USING (true); 