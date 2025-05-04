-- Seed data for advantages
insert into advantages (icon_name, title, description, badge, image_url, is_event, event_date, discount)
values
  (
    'Gift',
    'Réduction exclusive',
    'Profitez de -20% sur toutes les activités nautiques ce mois-ci !',
    'Offre limitée',
    'https://images.unsplash.com/photo-1564419320461-6870880221ad?q=80&w=2070',
    false,
    null,
    '20%'
  ),
  (
    'Music',
    'Concert privé',
    'Concert exclusif pour les membres du Club Créole',
    'VIP',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070',
    true,
    '2024-07-15 20:00:00+00',
    '15%'
  ),
  (
    'Hotel',
    'Week-end détente',
    'Séjour tout inclus dans un hôtel de luxe',
    'Premium',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2049',
    true,
    '2024-08-01 14:00:00+00',
    '25%'
  );

create table activities (
  id serial primary key,
  title text not null,
  description text not null,
  location text not null,
  date text not null,
  max_participants integer not null,
  current_participants integer not null,
  image text not null
);

insert into activities (title, description, location, date, max_participants, current_participants, image) values
('Atelier cuisine créole', 'Apprenez à préparer les plats traditionnels de la cuisine antillaise avec un chef local.', 'Fort-de-France, Martinique', '15 juin 2024, 14:00', 12, 8, 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop'),
('Festival de danse et musique', 'Découvrez les rythmes traditionnels du zouk, de la biguine et du gwoka lors de ce festival animé.', 'Pointe-à-Pitre, Guadeloupe', '22 juin 2024, 18:00', 50, 32, 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070&auto=format&fit=crop'),
('Atelier artisanat local', 'Initiez-vous à la fabrication de bijoux et d\'objets décoratifs à partir de matériaux locaux.', 'Saint-Pierre, Martinique', '29 juin 2024, 10:00', 15, 6, 'https://images.unsplash.com/photo-1462927114214-6956d2fddd4e?q=80&w=2069&auto=format&fit=crop'),
('Visite d\'une distillerie de rhum', 'Découvrez le processus de fabrication du rhum et dégustez différentes variétés de ce spiritueux emblématique.', 'Sainte-Marie, Martinique', '5 juillet 2024, 11:00', 20, 12, 'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?q=80&w=2074&auto=format&fit=crop'),
('Atelier percussion et tambour', 'Apprenez les bases des rythmes traditionnels avec des musiciens locaux expérimentés.', 'Le Gosier, Guadeloupe', '12 juillet 2024, 16:00', 15, 9, 'https://images.unsplash.com/photo-1485579149621-3123dd979885?q=80&w=2069&auto=format&fit=crop'),
('Sortie en boite - La Créolita', 'Profitez d\'une soirée inoubliable dans l\'une des boîtes de nuit les plus populaires des Antilles avec musique zouk et cocktails tropicaux.', 'Trois-Îlets, Martinique', '18 juin 2024, 22:00', 30, 15, 'https://images.unsplash.com/photo-1545128485-c400ce7b0aa2?q=80&w=2070&auto=format&fit=crop'),
('Sortie cinéma - Film créole', 'Projection exclusive d\'un film créole suivi d\'une discussion avec le réalisateur sur la culture et l\'identité antillaise.', 'Basse-Terre, Guadeloupe', '25 juin 2024, 19:30', 40, 22, 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=2070&auto=format&fit=crop'),
('Balade dans la forêt tropicale', 'Randonnée guidée dans la forêt tropicale avec un guide local qui vous fera découvrir la faune et la flore exceptionnelles des Antilles.', 'Parc National de la Guadeloupe', '30 juin 2024, 09:00', 18, 10, 'https://images.unsplash.com/photo-1550236520-7050f3582da0?q=80&w=2075&auto=format&fit=crop');

alter table activities enable row level security;

create policy "Activities are viewable by everyone"
  on activities for select
  using (true); 