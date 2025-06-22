-- Criação da tabela de categorias de carros de rally
CREATE TABLE IF NOT EXISTS "public"."rsf_car_categories" (
    "id" integer NOT NULL,
    "name" character varying(50) NOT NULL,
    "description" character varying(200),
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "public"."rsf_car_categories" OWNER TO "postgres";

-- Sequência para a tabela de categorias
CREATE SEQUENCE IF NOT EXISTS "public"."rsf_car_categories_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."rsf_car_categories_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."rsf_car_categories_id_seq" OWNED BY "public"."rsf_car_categories"."id";

-- Definir valor padrão para o ID da tabela de categorias
ALTER TABLE ONLY "public"."rsf_car_categories" ALTER COLUMN "id" SET DEFAULT nextval('"public"."rsf_car_categories_id_seq"'::regclass);

-- Chave primária para a tabela de categorias
ALTER TABLE ONLY "public"."rsf_car_categories"
    ADD CONSTRAINT "rsf_car_categories_pkey" PRIMARY KEY ("id");

-- Constraint de unicidade para o nome da categoria
ALTER TABLE ONLY "public"."rsf_car_categories"
    ADD CONSTRAINT "rsf_car_categories_name_key" UNIQUE ("name");

-- Modificação na tabela rsf_cars para relacionar com categorias
-- (A coluna category_id já existe no schema original)
ALTER TABLE ONLY "public"."rsf_cars"
    ADD CONSTRAINT "rsf_cars_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."rsf_car_categories"("id");

-- Adição de coluna category_id na tabela rsf_rally_points
ALTER TABLE "public"."rsf_rally_points" 
    ADD COLUMN "category_id" integer;

-- Relacionamento entre rsf_rally_points e rsf_car_categories
ALTER TABLE ONLY "public"."rsf_rally_points"
    ADD CONSTRAINT "rsf_rally_points_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."rsf_car_categories"("id");

-- Índices para melhor performance
CREATE INDEX "idx_rsf_cars_category_id" ON "public"."rsf_cars" USING btree ("category_id");
CREATE INDEX "idx_rsf_rally_points_category_id" ON "public"."rsf_rally_points" USING btree ("category_id");

-- Inserção de categorias padrão de rally
INSERT INTO "public"."rsf_car_categories" ("name", "description") VALUES
    ('RC1', 'Rally Car 1 - Carros de rally de alta performance'),
    ('RC2', 'Rally Car 2 - Carros de rally de performance intermediária'),
    ('RC3', 'Rally Car 3 - Carros de rally de entrada'),
    ('RC4', 'Rally Car 4 - Carros de rally básicos'),
    ('RC5', 'Rally Car 5 - Carros de rally históricos'),
    ('RGT', 'Rally Grand Touring - Carros GT adaptados para rally'),
    ('R5', 'Rally 5 - Carros R5 de alta tecnologia'),
    ('WRC', 'World Rally Car - Carros do campeonato mundial'),
    ('R2', 'Rally 2 - Carros R2 de entrada'),
    ('R3', 'Rally 3 - Carros R3 intermediários'),
    ('R4', 'Rally 4 - Carros R4 avançados');

-- Políticas RLS (Row Level Security) para a nova tabela
CREATE POLICY "Enable read access for all users" ON "public"."rsf_car_categories" FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON "public"."rsf_car_categories" FOR INSERT TO "authenticated" WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON "public"."rsf_car_categories" FOR UPDATE TO "authenticated" USING (true);

-- Ativar RLS na tabela
ALTER TABLE "public"."rsf_car_categories" ENABLE ROW LEVEL SECURITY;