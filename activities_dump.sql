--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 16.8 (Ubuntu 16.8-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activities (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    location text NOT NULL,
    date text NOT NULL,
    max_participants integer DEFAULT 0 NOT NULL,
    current_participants integer DEFAULT 0 NOT NULL,
    image_url text NOT NULL
);


ALTER TABLE public.activities OWNER TO postgres;

--
-- Name: activities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activities_id_seq OWNER TO postgres;

--
-- Name: activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.activities_id_seq OWNED BY public.activities.id;


--
-- Name: activities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities ALTER COLUMN id SET DEFAULT nextval('public.activities_id_seq'::regclass);


--
-- Data for Name: activities; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO activities (id, title, description, location, date, max_participants, current_participants, image_url) 
VALUES 
(1, 'Atelier cuisine créole', 'Apprenez à préparer les plats traditionnels de la cuisine antillaise avec un chef local.', 'Fort-de-France, Martinique', '2024-06-15 14:00:00', 150, 100, 'http://127.0.0.1:54321/storage/v1/object/public/images/loisirs/1746284656708-whqk4psp6xi.jpg'),
(2, 'Festival de danse et musique', 'Découvrez les rythmes traditionnels du zouk, de la biguine et du gwoka lors de ce festival animé.', 'Pointe-à-Pitre, Guadeloupe', '2024-06-22 18:00:00', 50, 32, 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070&auto=format&fit=crop'),
(3, 'Atelier artisanat local', 'Initiez-vous à la fabrication de bijoux et d''objets décoratifs à partir de matériaux locaux.', 'Saint-Pierre, Martinique', '2024-06-29 10:00:00', 15, 6, 'https://images.unsplash.com/photo-1462927114214-6956d2fddd4e?q=80&w=2069&auto=format&fit=crop'),
(4, 'Visite d''une distillerie de rhum', 'Découvrez le processus de fabrication du rhum et dégustez différentes variétés de ce spiritueux emblématique.', 'Sainte-Marie, Martinique', '2024-07-05 11:00:00', 20, 12, 'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?q=80&w=2074&auto=format&fit=crop'),
(5, 'Atelier percussion et tambour', 'Apprenez les bases des rythmes traditionnels avec des musiciens locaux expérimentés.', 'Le Gosier, Guadeloupe', '2024-07-12 16:00:00', 15, 9, 'https://images.unsplash.com/photo-1485579149621-3123dd979885?q=80&w=2069&auto=format&fit=crop'),
(6, 'Sortie en boite - La Créolita', 'Profitez d''une soirée inoubliable dans l''une des boîtes de nuit les plus populaires des Antilles avec musique zouk et cocktails tropicaux.', 'Trois-Îlets, Martinique', '2024-06-18 22:00:00', 0, 0, 'http://127.0.0.1:54321/storage/v1/object/public/images/loisirs/1746284810922-vsdnv31h5l.webp'),
(7, 'Sortie cinéma - Film créole', 'Projection exclusive d''un film créole suivi d''une discussion avec le réalisateur sur la culture et l''identité antillaise.', 'Basse-Terre, Guadeloupe', '2024-06-25 19:30:00', 40, 22, 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=2070&auto=format&fit=crop'),
(8, 'Balade dans la forêt tropicale', 'Randonnée guidée dans la forêt tropicale avec un guide local qui vous fera découvrir la faune et la flore exceptionnelles des Antilles.', 'Parc National de la Guadeloupe', '2024-06-30 09:00:00', 18, 10, 'https://images.unsplash.com/photo-1550236520-7050f3582da0?q=80&w=2075&auto=format&fit=crop');


--
-- Name: activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activities_id_seq', 12, true);


--
-- Name: activities activities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (id);


--
-- Name: TABLE activities; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.activities TO anon;
GRANT ALL ON TABLE public.activities TO authenticated;
GRANT ALL ON TABLE public.activities TO service_role;


--
-- Name: SEQUENCE activities_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.activities_id_seq TO anon;
GRANT ALL ON SEQUENCE public.activities_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.activities_id_seq TO service_role;


--
-- PostgreSQL database dump complete
--

