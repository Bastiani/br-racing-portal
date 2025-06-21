-- Sistema de Pontuação por Categoria
-- Baseado no sistema WRC sem pontos bônus
-- Arquivo: category_points_system.sql

-- Tabela para definir as categorias de carros e suas configurações
CREATE TABLE IF NOT EXISTS "public"."rsf_car_categories" (
    "id" integer NOT NULL,
    "category_name" character varying(50) NOT NULL,
    "description" text,
    "active" boolean DEFAULT true,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE IF NOT EXISTS "public"."rsf_car_categories_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "public"."rsf_car_categories_id_seq" OWNED BY "public"."rsf_car_categories"."id";
ALTER TABLE ONLY "public"."rsf_car_categories" ALTER COLUMN "id" SET DEFAULT nextval('"public"."rsf_car_categories_id_seq"'::regclass);

-- Tabela para sistema de pontos por categoria
CREATE TABLE IF NOT EXISTS "public"."rsf_category_points_system" (
    "id" integer NOT NULL,
    "category_id" integer NOT NULL,
    "position" integer NOT NULL,
    "points" integer NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE IF NOT EXISTS "public"."rsf_category_points_system_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "public"."rsf_category_points_system_id_seq" OWNED BY "public"."rsf_category_points_system"."id";
ALTER TABLE ONLY "public"."rsf_category_points_system" ALTER COLUMN "id" SET DEFAULT nextval('"public"."rsf_category_points_system_id_seq"'::regclass);

-- Tabela para classificação por categoria
CREATE TABLE IF NOT EXISTS "public"."rsf_category_standings" (
    "id" integer NOT NULL,
    "championship_id" integer NOT NULL,
    "category_id" integer NOT NULL,
    "pilot_id" integer NOT NULL,
    "total_points" integer DEFAULT 0,
    "rallies_completed" integer DEFAULT 0,
    "wins" integer DEFAULT 0,
    "podiums" integer DEFAULT 0,
    "current_position" integer,
    "last_updated" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE IF NOT EXISTS "public"."rsf_category_standings_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "public"."rsf_category_standings_id_seq" OWNED BY "public"."rsf_category_standings"."id";
ALTER TABLE ONLY "public"."rsf_category_standings" ALTER COLUMN "id" SET DEFAULT nextval('"public"."rsf_category_standings_id_seq"'::regclass);

-- Tabela para pontos por categoria em cada rally
CREATE TABLE IF NOT EXISTS "public"."rsf_rally_category_points" (
    "id" integer NOT NULL,
    "rally_id" integer NOT NULL,
    "pilot_id" integer NOT NULL,
    "category_id" integer NOT NULL,
    "category_position" integer NOT NULL,
    "category_points_earned" integer DEFAULT 0,
    "car_id" integer NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE IF NOT EXISTS "public"."rsf_rally_category_points_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "public"."rsf_rally_category_points_id_seq" OWNED BY "public"."rsf_rally_category_points"."id";
ALTER TABLE ONLY "public"."rsf_rally_category_points" ALTER COLUMN "id" SET DEFAULT nextval('"public"."rsf_rally_category_points_id_seq"'::regclass);

-- Constraints e índices
ALTER TABLE ONLY "public"."rsf_car_categories"
    ADD CONSTRAINT "rsf_car_categories_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."rsf_car_categories"
    ADD CONSTRAINT "rsf_car_categories_category_name_key" UNIQUE ("category_name");

ALTER TABLE ONLY "public"."rsf_category_points_system"
    ADD CONSTRAINT "rsf_category_points_system_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."rsf_category_points_system"
    ADD CONSTRAINT "rsf_category_points_system_category_position_key" UNIQUE ("category_id", "position");

ALTER TABLE ONLY "public"."rsf_category_standings"
    ADD CONSTRAINT "rsf_category_standings_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."rsf_category_standings"
    ADD CONSTRAINT "rsf_category_standings_championship_category_pilot_key" UNIQUE ("championship_id", "category_id", "pilot_id");

ALTER TABLE ONLY "public"."rsf_rally_category_points"
    ADD CONSTRAINT "rsf_rally_category_points_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."rsf_rally_category_points"
    ADD CONSTRAINT "rsf_rally_category_points_rally_pilot_category_key" UNIQUE ("rally_id", "pilot_id", "category_id");

-- Foreign Keys
ALTER TABLE ONLY "public"."rsf_category_points_system"
    ADD CONSTRAINT "rsf_category_points_system_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."rsf_car_categories"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."rsf_category_standings"
    ADD CONSTRAINT "rsf_category_standings_championship_id_fkey" FOREIGN KEY ("championship_id") REFERENCES "public"."rsf_championships"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."rsf_category_standings"
    ADD CONSTRAINT "rsf_category_standings_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."rsf_car_categories"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."rsf_category_standings"
    ADD CONSTRAINT "rsf_category_standings_pilot_id_fkey" FOREIGN KEY ("pilot_id") REFERENCES "public"."rsf_pilots"("userid") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."rsf_rally_category_points"
    ADD CONSTRAINT "rsf_rally_category_points_rally_id_fkey" FOREIGN KEY ("rally_id") REFERENCES "public"."rsf_rallies"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."rsf_rally_category_points"
    ADD CONSTRAINT "rsf_rally_category_points_pilot_id_fkey" FOREIGN KEY ("pilot_id") REFERENCES "public"."rsf_pilots"("userid") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."rsf_rally_category_points"
    ADD CONSTRAINT "rsf_rally_category_points_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."rsf_car_categories"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."rsf_rally_category_points"
    ADD CONSTRAINT "rsf_rally_category_points_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "public"."rsf_cars"("id") ON DELETE CASCADE;

-- Modificar tabela rsf_cars para referenciar categorias
ALTER TABLE "public"."rsf_cars" 
    ADD COLUMN IF NOT EXISTS "category_id" integer;

ALTER TABLE ONLY "public"."rsf_cars"
    ADD CONSTRAINT "rsf_cars_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."rsf_car_categories"("id");

-- Índices para performance
CREATE INDEX IF NOT EXISTS "idx_rsf_category_standings_points" ON "public"."rsf_category_standings" USING btree ("championship_id", "category_id", "total_points" DESC);
CREATE INDEX IF NOT EXISTS "idx_rsf_rally_category_points_rally_category" ON "public"."rsf_rally_category_points" USING btree ("rally_id", "category_id");
CREATE INDEX IF NOT EXISTS "idx_rsf_cars_category" ON "public"."rsf_cars" USING btree ("category_id");

-- Inserir categorias padrão baseadas no WRC
INSERT INTO "public"."rsf_car_categories" ("category_name", "description") VALUES
('WRC', 'World Rally Car - Categoria principal'),
('WRC2', 'World Rally Championship 2 - Carros R5/Rally2'),
('WRC3', 'World Rally Championship 3 - Carros R2/Rally3'),
('JWRC', 'Junior World Rally Championship'),
('R5', 'Rally2 - Carros de especificação R5'),
('R4', 'Rally4 - Carros de especificação R4'),
('R3', 'Rally3 - Carros de especificação R3'),
('R2', 'Rally2 - Carros de especificação R2'),
('R1', 'Rally1 - Carros de especificação R1'),
('Historic', 'Carros históricos')
ON CONFLICT ("category_name") DO NOTHING;

-- Sistema de pontos WRC padrão (sem pontos bônus)
-- Para cada categoria, inserir o mesmo sistema de pontos
DO $$
DECLARE
    cat_record RECORD;
    points_array integer[] := ARRAY[25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
    i integer;
BEGIN
    FOR cat_record IN SELECT id FROM "public"."rsf_car_categories" LOOP
        FOR i IN 1..10 LOOP
            INSERT INTO "public"."rsf_category_points_system" ("category_id", "position", "points")
            VALUES (cat_record.id, i, points_array[i])
            ON CONFLICT ("category_id", "position") DO NOTHING;
        END LOOP;
    END LOOP;
END $$;

-- Função para calcular pontos por categoria em um rally
CREATE OR REPLACE FUNCTION "public"."calculate_rally_category_points"("p_rally_id" integer)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    cat_record RECORD;
    pilot_record RECORD;
    category_position integer;
    points_earned integer;
BEGIN
    -- Limpar pontos existentes para este rally
    DELETE FROM "public"."rsf_rally_category_points" WHERE "rally_id" = p_rally_id;
    
    -- Para cada categoria ativa
    FOR cat_record IN 
        SELECT DISTINCT cc.id as category_id, cc.category_name
        FROM "public"."rsf_car_categories" cc
        WHERE cc.active = true
    LOOP
        -- Calcular posições por categoria neste rally
        category_position := 1;
        
        FOR pilot_record IN
            SELECT 
                rp.pilot_id,
                rp.rally_id,
                sr.car_id,
                rp.total_time,
                ROW_NUMBER() OVER (ORDER BY rp.total_time ASC) as position
            FROM "public"."rsf_rally_points" rp
            JOIN "public"."rsf_stage_results" sr ON sr.pilot_id = rp.pilot_id
            JOIN "public"."rsf_stages" s ON s.id = sr.stage_id AND s.rally_id = rp.rally_id
            JOIN "public"."rsf_cars" c ON c.id = sr.car_id
            WHERE rp.rally_id = p_rally_id 
                AND c.category_id = cat_record.category_id
            GROUP BY rp.pilot_id, rp.rally_id, sr.car_id, rp.total_time
            ORDER BY rp.total_time ASC
        LOOP
            -- Buscar pontos para esta posição na categoria
            SELECT COALESCE(cps.points, 0) INTO points_earned
            FROM "public"."rsf_category_points_system" cps
            WHERE cps.category_id = cat_record.category_id 
                AND cps.position = category_position;
            
            -- Inserir pontos por categoria
            INSERT INTO "public"."rsf_rally_category_points" 
                ("rally_id", "pilot_id", "category_id", "category_position", "category_points_earned", "car_id")
            VALUES 
                (p_rally_id, pilot_record.pilot_id, cat_record.category_id, category_position, COALESCE(points_earned, 0), pilot_record.car_id);
            
            category_position := category_position + 1;
        END LOOP;
    END LOOP;
END;
$$;

-- Função para atualizar classificação por categoria
CREATE OR REPLACE FUNCTION "public"."update_category_standings"("p_championship_id" integer, "p_category_id" integer)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- Inserir ou atualizar standings por categoria
    INSERT INTO "public"."rsf_category_standings" 
        ("championship_id", "category_id", "pilot_id", "total_points", "rallies_completed", "wins", "podiums")
    SELECT 
        p_championship_id,
        p_category_id,
        rcp.pilot_id,
        COALESCE(SUM(rcp.category_points_earned), 0) as total_points,
        COUNT(*) as rallies_completed,
        COUNT(CASE WHEN rcp.category_position = 1 THEN 1 END) as wins,
        COUNT(CASE WHEN rcp.category_position <= 3 THEN 1 END) as podiums
    FROM "public"."rsf_rally_category_points" rcp
    JOIN "public"."rsf_rallies" r ON r.id = rcp.rally_id
    WHERE r.championship_id = p_championship_id 
        AND rcp.category_id = p_category_id
    GROUP BY rcp.pilot_id
    ON CONFLICT ("championship_id", "category_id", "pilot_id") 
    DO UPDATE SET
        "total_points" = EXCLUDED."total_points",
        "rallies_completed" = EXCLUDED."rallies_completed",
        "wins" = EXCLUDED."wins",
        "podiums" = EXCLUDED."podiums",
        "last_updated" = CURRENT_TIMESTAMP;
    
    -- Atualizar posições atuais na categoria
    WITH ranked_pilots AS (
        SELECT 
            pilot_id,
            ROW_NUMBER() OVER (ORDER BY total_points DESC, wins DESC, podiums DESC) as new_position
        FROM "public"."rsf_category_standings"
        WHERE championship_id = p_championship_id AND category_id = p_category_id
    )
    UPDATE "public"."rsf_category_standings" cs
    SET current_position = rp.new_position
    FROM ranked_pilots rp
    WHERE cs.pilot_id = rp.pilot_id 
        AND cs.championship_id = p_championship_id 
        AND cs.category_id = p_category_id;
END;
$$;

-- View para classificação atual por categoria
CREATE OR REPLACE VIEW "public"."v_rsf_category_current_standings" AS
SELECT 
    cs.championship_id,
    c.name AS championship_name,
    cs.category_id,
    cc.category_name,
    cs.current_position,
    p.username,
    p.real_name,
    p.nationality,
    cs.total_points,
    cs.rallies_completed,
    cs.wins,
    cs.podiums,
    cs.last_updated
FROM "public"."rsf_category_standings" cs
JOIN "public"."rsf_pilots" p ON cs.pilot_id = p.userid
JOIN "public"."rsf_championships" c ON cs.championship_id = c.id
JOIN "public"."rsf_car_categories" cc ON cs.category_id = cc.id
WHERE c.status = 'active' AND cc.active = true
ORDER BY cs.championship_id, cs.category_id, cs.total_points DESC, cs.wins DESC, cs.podiums DESC;

-- View para resultados detalhados por categoria
CREATE OR REPLACE VIEW "public"."v_rsf_rally_category_results" AS
SELECT 
    r.name AS rally_name,
    r.rally_date,
    cc.category_name,
    rcp.category_position,
    p.username,
    p.real_name,
    p.nationality,
    car.model AS car_model,
    rcp.category_points_earned,
    rp.total_time
FROM "public"."rsf_rally_category_points" rcp
JOIN "public"."rsf_rallies" r ON rcp.rally_id = r.id
JOIN "public"."rsf_pilots" p ON rcp.pilot_id = p.userid
JOIN "public"."rsf_car_categories" cc ON rcp.category_id = cc.id
JOIN "public"."rsf_cars" car ON rcp.car_id = car.id
JOIN "public"."rsf_rally_points" rp ON rp.rally_id = r.id AND rp.pilot_id = p.userid
ORDER BY r.rally_date DESC, cc.category_name, rcp.category_position;

-- Políticas RLS (Row Level Security)
CREATE POLICY "Enable read access for all users" ON "public"."rsf_car_categories" FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON "public"."rsf_category_points_system" FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON "public"."rsf_category_standings" FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON "public"."rsf_rally_category_points" FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."rsf_car_categories" FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable insert for authenticated users only" ON "public"."rsf_category_points_system" FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable insert for authenticated users only" ON "public"."rsf_category_standings" FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable insert for authenticated users only" ON "public"."rsf_rally_category_points" FOR INSERT TO authenticated WITH CHECK (true);

-- Habilitar RLS
ALTER TABLE "public"."rsf_car_categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."rsf_category_points_system" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."rsf_category_standings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."rsf_rally_category_points" ENABLE ROW LEVEL SECURITY;

-- Comentários nas tabelas
COMMENT ON TABLE "public"."rsf_car_categories" IS 'Categorias de carros para classificação separada';
COMMENT ON TABLE "public"."rsf_category_points_system" IS 'Sistema de pontos por categoria baseado no WRC';
COMMENT ON TABLE "public"."rsf_category_standings" IS 'Classificação dos pilotos por categoria em cada campeonato';
COMMENT ON TABLE "public"."rsf_rally_category_points" IS 'Pontos obtidos por categoria em cada rally';

COMMENT ON FUNCTION "public"."calculate_rally_category_points"(integer) IS 'Calcula pontos por categoria para um rally específico';
COMMENT ON FUNCTION "public"."update_category_standings"(integer, integer) IS 'Atualiza classificação por categoria em um campeonato';