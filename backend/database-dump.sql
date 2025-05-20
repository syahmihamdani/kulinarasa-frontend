--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: transaction_status; Type: TYPE; Schema: public; Owner: express_AnthoniusHendhyWirawan_owner
--

CREATE TYPE public.transaction_status AS ENUM (
    'pending',
    'paid'
);


ALTER TYPE public.transaction_status OWNER TO "express_AnthoniusHendhyWirawan_owner";

--
-- Name: type; Type: TYPE; Schema: public; Owner: express_AnthoniusHendhyWirawan_owner
--

CREATE TYPE public.type AS ENUM (
    'dessert',
    'main course',
    'appetizer',
    'beverage'
);


ALTER TYPE public.type OWNER TO "express_AnthoniusHendhyWirawan_owner";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: recipes; Type: TABLE; Schema: public; Owner: express_AnthoniusHendhyWirawan_owner
--

CREATE TABLE public.recipes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    author_id uuid,
    name character varying(255) NOT NULL,
    caption text,
    image_url character varying(255) NOT NULL,
    food_type public.type NOT NULL,
    ingredients text NOT NULL,
    procedure text NOT NULL,
    is_public boolean NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.recipes OWNER TO "express_AnthoniusHendhyWirawan_owner";

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: express_AnthoniusHendhyWirawan_owner
--

CREATE TABLE public.reviews (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    recipe_id uuid,
    rating integer,
    review_text text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.reviews OWNER TO "express_AnthoniusHendhyWirawan_owner";

--
-- Name: users; Type: TABLE; Schema: public; Owner: express_AnthoniusHendhyWirawan_owner
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO "express_AnthoniusHendhyWirawan_owner";

--
-- Data for Name: recipes; Type: TABLE DATA; Schema: public; Owner: express_AnthoniusHendhyWirawan_owner
--

COPY public.recipes (id, author_id, name, caption, image_url, food_type, ingredients, procedure, is_public, created_at) FROM stdin;
3af74262-ae5b-4f59-a124-e1e7c48b68c0	569bc3d7-c775-4012-aa24-f27580293e6f	Gulai Tunjang	Gulai tunjang adalah hidangan khas Padang yang menggunakan tunjang atau kikil (bagian kaki sapi yang terdiri dari kulit, tulang rawan, dan otot) sebagai bahan utama. Tunjang dimasak dengan bumbu gulai khas Minangkabau yang kaya rempah dan santan, menghasilkan kuah yang kental, berwarna kekuningan hingga kemerahan, dan kaya rasa gurih, pedas, serta aromatik. 	https://res.cloudinary.com/dzfakh5xb/image/upload/v1747226469/image.webp	main course	1/2 kg tunjang\n1/4 kg rebung\n1,5 Liter santan\n4 sdt pemasak kambing\n60 gram cabe giling\n5 siung bawang putih\n8 siung bawang merah\n1 cm jahe\n1 cm lengkuas\n1 cm kunyit\n1 batang sereh\n1 lembar daun kunyit\n3 lembar daun jeruk\n1 lembar daun salam	1. Tumis bumbu halus sampai harum.\n2. Masukkan pemasak.\n3.Tuang santan.\n4. Masukkan rebung dan tunjang. Masak hingga kuah mengental\n5 Sajikan	t	2025-05-14 12:53:34.587902
bed07f12-c2e0-4dbe-b865-07bbf5f4a9a9	569bc3d7-c775-4012-aa24-f27580293e6f	Gulai Tunjang	Gulai tunjang adalah hidangan khas Padang yang menggunakan tunjang atau kikil (bagian kaki sapi yang terdiri dari kulit, tulang rawan, dan otot) sebagai bahan utama. Tunjang dimasak dengan bumbu gulai khas Minangkabau yang kaya rempah dan santan, menghasilkan kuah yang kental, berwarna kekuningan hingga kemerahan, dan kaya rasa gurih, pedas, serta aromatik. 	https://res.cloudinary.com/dzfakh5xb/image/upload/v1747226469/image.webp	main course	1/2 kg tunjang\n1/4 kg rebung\n1,5 Liter santan\n4 sdt pemasak kambing\n60 gram cabe giling\n5 siung bawang putih\n8 siung bawang merah\n1 cm jahe\n1 cm lengkuas\n1 cm kunyit\n1 batang sereh\n1 lembar daun kunyit\n3 lembar daun jeruk\n1 lembar daun salam	1. Tumis bumbu halus sampai harum.\n2. Masukkan pemasak.\n3.Tuang santan.\n4. Masukkan rebung dan tunjang. Masak hingga kuah mengental\n5 Sajikan	f	2025-05-14 13:18:12.564211
dc10088e-9a12-4a91-afe0-f104e44398d1	f57d2748-b78a-437b-b5d4-d6caa368a209	Rendang	Rendang adalah hidangan tradisional Indonesia, khususnya dari daerah Minangkabau, yang terkenal dengan dagingnya yang dimasak lambat (seringkali daging sapi, tetapi bisa juga ayam atau daging lainnya) dalam santan dan campuran rempah-rempah aromatik . Proses memasaknya menghasilkan hidangan kari yang kaya, penuh rasa, dan relatif kering (tidak seperti semur).	https://res.cloudinary.com/dzfakh5xb/image/upload/v1747698837/image.jpg	main course	1 Kg Daging	Masak Rendang	t	2025-05-20 00:14:20.485739
cccabd31-cfb5-4382-9700-20ab41ed941f	f57d2748-b78a-437b-b5d4-d6caa368a209	Sate Ayam	Sate ayam enak dan mudah dibuat	https://res.cloudinary.com/dzfakh5xb/image/upload/v1747708039/image.jpg	appetizer	5 Tusuk Tusuk Sate\r\n50 g Ayam	Masukkan ayam ke tusuk sate\r\nMakan Sate Ayam	t	2025-05-20 02:27:20.246237
62ff0ca1-eb0a-48f5-ad78-e26bf5e47937	33f89317-b1e6-418b-b5b2-c90f9d812fdd	Bakso	Bakso bulat	https://res.cloudinary.com/dzfakh5xb/image/upload/v1747710148/image.jpg	main course	1 kg bakso	buat bakso	t	2025-05-20 03:02:30.418633
1a0ce42a-1cd6-4b07-aa7b-347a22fd3009	9776dd80-08d3-49af-a6e9-cdcf603af13a	Rendang	rendang	https://res.cloudinary.com/dzfakh5xb/image/upload/v1747734539/image.jpg	main course	1 200g daging	masak	t	2025-05-20 09:49:00.467387
52df4866-554f-4147-95a1-1acc436d0f08	33f89317-b1e6-418b-b5b2-c90f9d812fdd	tes	tes	https://res.cloudinary.com/dzfakh5xb/image/upload/v1747747292/image.png	dessert	1 2 Tes\r\n1 2 re	sfsfs	t	2025-05-20 13:21:33.483415
ed549575-dd4d-4344-b8a9-83065560e153	9776dd80-08d3-49af-a6e9-cdcf603af13a	ayam goreng	ayam	https://res.cloudinary.com/dzfakh5xb/image/upload/v1747751420/image.jpg	main course	1 200g daging	masak	t	2025-05-20 14:30:22.559149
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: express_AnthoniusHendhyWirawan_owner
--

COPY public.reviews (id, user_id, recipe_id, rating, review_text, created_at) FROM stdin;
543f5915-6ccf-4766-a44f-b68a5aa4f713	569bc3d7-c775-4012-aa24-f27580293e6f	3af74262-ae5b-4f59-a124-e1e7c48b68c0	5	Great recipe, Love It It	2025-05-16 12:54:06.803502
81c952af-433a-4dc0-b41d-96c5c70c4855	33f89317-b1e6-418b-b5b2-c90f9d812fdd	cccabd31-cfb5-4382-9700-20ab41ed941f	1	tes	2025-05-20 03:54:38.404751
bd843c3f-affe-4536-bdd2-1c73bf9aedf6	33f89317-b1e6-418b-b5b2-c90f9d812fdd	3af74262-ae5b-4f59-a124-e1e7c48b68c0	5	Nice	2025-05-20 13:05:49.712212
4c6c3000-8ced-48c1-a4af-0dc4a68b128c	33f89317-b1e6-418b-b5b2-c90f9d812fdd	3af74262-ae5b-4f59-a124-e1e7c48b68c0	5	Tes Review	2025-05-20 13:19:52.686458
80bb22b0-6862-480e-a1c3-7adfd2e47774	33f89317-b1e6-418b-b5b2-c90f9d812fdd	3af74262-ae5b-4f59-a124-e1e7c48b68c0	2	tes	2025-05-20 13:20:16.274652
0b514f04-b1e7-4c69-85a9-02bf9e06492a	33f89317-b1e6-418b-b5b2-c90f9d812fdd	ed549575-dd4d-4344-b8a9-83065560e153	5	Bahan dan resep kurang lengkap. Gambar ga meyakinkan 👎🏽	2025-05-20 14:32:07.608588
02ef2e46-0d80-4a2b-8f3c-65664ab433f1	f57d2748-b78a-437b-b5d4-d6caa368a209	ed549575-dd4d-4344-b8a9-83065560e153	1	Ga enak bgt	2025-05-20 14:48:32.286158
0ff82ebc-8de7-4154-a9f9-58ce25ef84d0	05fb6dd8-d01b-427f-a92c-0dbfc8e20182	dc10088e-9a12-4a91-afe0-f104e44398d1	3	saya saya suka sekali rendang tapi pedas	2025-05-20 15:31:21.373701
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: express_AnthoniusHendhyWirawan_owner
--

COPY public.users (id, name, email, password, created_at) FROM stdin;
569bc3d7-c775-4012-aa24-f27580293e6f	admin	test@mail.com	$2b$10$SpY3HaABdOVPWXClEWaDTu70nMNWJ7BdAhmpRquDm0Sl/N.pmqH2G	2025-05-12 15:08:08.024007
f57d2748-b78a-437b-b5d4-d6caa368a209	admin	admin@mail.com	$2b$10$H6t9R6n3YWiqRnm2DXXZF.QB/JlkQ5W/ldPlKrm0OVA.W7LRS2d.i	2025-05-19 21:52:54.237068
33f89317-b1e6-418b-b5b2-c90f9d812fdd	syahmi	syahmi@mail.com	$2b$10$qiOXtsZwRFRmh9B/Kc6NPu9NOBL.sN3aYNtadjjp8ReX9kCLEUDFG	2025-05-20 03:01:12.558311
9776dd80-08d3-49af-a6e9-cdcf603af13a	rifat	rifat@mail.com	$2b$10$oLskwoDMgVNiSz65DjbVKuBXvfi.aoyPspfm/NJAr7lRR40J4pwDy	2025-05-20 09:47:49.866823
05fb6dd8-d01b-427f-a92c-0dbfc8e20182	Maharaka Fadhilah	maharaka.fadhilah@gmail.com	$2b$10$O9V5jMHGpGaSShbm6Aig8esFtAcbcCt6EIn4MT0q9l6appnOJplP6	2025-05-20 15:30:46.030931
\.


--
-- Name: recipes recipes_pkey; Type: CONSTRAINT; Schema: public; Owner: express_AnthoniusHendhyWirawan_owner
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: express_AnthoniusHendhyWirawan_owner
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: express_AnthoniusHendhyWirawan_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: express_AnthoniusHendhyWirawan_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: recipes recipes_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: express_AnthoniusHendhyWirawan_owner
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: express_AnthoniusHendhyWirawan_owner
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

