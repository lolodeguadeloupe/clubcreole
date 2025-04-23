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