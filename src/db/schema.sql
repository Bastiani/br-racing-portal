

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


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."update_championship_standings"("p_championship_id" integer) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Recalcular pontos totais e estatísticas
    UPDATE championship_standings cs
    SET 
        total_points = (
            SELECT COALESCE(SUM(rp.points_earned), 0)
            FROM rally_points rp
            JOIN rallies r ON rp.rally_id = r.id
            WHERE r.championship_id = p_championship_id 
            AND rp.pilot_id = cs.pilot_id
        ),
        rallies_completed = (
            SELECT COUNT(*)
            FROM rally_points rp
            JOIN rallies r ON rp.rally_id = r.id
            WHERE r.championship_id = p_championship_id 
            AND rp.pilot_id = cs.pilot_id
        ),
        wins = (
            SELECT COUNT(*)
            FROM rally_points rp
            JOIN rallies r ON rp.rally_id = r.id
            WHERE r.championship_id = p_championship_id 
            AND rp.pilot_id = cs.pilot_id
            AND rp.overall_position = 1
        ),
        podiums = (
            SELECT COUNT(*)
            FROM rally_points rp
            JOIN rallies r ON rp.rally_id = r.id
            WHERE r.championship_id = p_championship_id 
            AND rp.pilot_id = cs.pilot_id
            AND rp.overall_position <= 3
        ),
        last_updated = CURRENT_TIMESTAMP
    WHERE cs.championship_id = p_championship_id;
    
    -- Atualizar posições atuais
    WITH ranked_pilots AS (
        SELECT 
            pilot_id,
            ROW_NUMBER() OVER (ORDER BY total_points DESC, wins DESC, podiums DESC) as new_position
        FROM championship_standings
        WHERE championship_id = p_championship_id
    )
    UPDATE championship_standings cs
    SET current_position = rp.new_position
    FROM ranked_pilots rp
    WHERE cs.pilot_id = rp.pilot_id AND cs.championship_id = p_championship_id;
END;
$$;


ALTER FUNCTION "public"."update_championship_standings"("p_championship_id" integer) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."rsf-online-rally" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "rally_name" "text" NOT NULL,
    "rally_id" numeric
);


ALTER TABLE "public"."rsf-online-rally" OWNER TO "postgres";


COMMENT ON TABLE "public"."rsf-online-rally" IS 'Tabela para cadastrar uma sala criada no modo Online Rally do RSF';



CREATE TABLE IF NOT EXISTS "public"."rsf-results" (
    "position" bigint,
    "userid" bigint NOT NULL,
    "user_name" "text",
    "real_name" "text",
    "nationality" "text",
    "car" "text",
    "time3" "text",
    "super_rally" "text",
    "penalty" "text",
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "rsf_rally" "uuid"
);


ALTER TABLE "public"."rsf-results" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."rsf-users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" character varying,
    "victories" bigint,
    "nationality" character varying,
    "rsf_id" bigint NOT NULL,
    "first" bigint,
    "second" bigint,
    "third" bigint
);


ALTER TABLE "public"."rsf-users" OWNER TO "postgres";


COMMENT ON TABLE "public"."rsf-users" IS 'Pilotos do RSF';



CREATE TABLE IF NOT EXISTS "public"."rsf_cars" (
    "id" integer NOT NULL,
    "model" character varying(100) NOT NULL,
    "category" character varying(50) DEFAULT 'R2'::character varying,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."rsf_cars" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."rsf_cars_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."rsf_cars_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."rsf_cars_id_seq" OWNED BY "public"."rsf_cars"."id";



CREATE TABLE IF NOT EXISTS "public"."rsf_championship_standings" (
    "id" integer NOT NULL,
    "championship_id" integer,
    "pilot_id" integer,
    "total_points" integer DEFAULT 0,
    "rallies_completed" integer DEFAULT 0,
    "wins" integer DEFAULT 0,
    "podiums" integer DEFAULT 0,
    "current_position" integer,
    "last_updated" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."rsf_championship_standings" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."rsf_championship_standings_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."rsf_championship_standings_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."rsf_championship_standings_id_seq" OWNED BY "public"."rsf_championship_standings"."id";



CREATE TABLE IF NOT EXISTS "public"."rsf_championships" (
    "id" integer NOT NULL,
    "name" character varying(200) NOT NULL,
    "season" integer NOT NULL,
    "status" character varying(20) DEFAULT 'active'::character varying,
    "start_date" "date",
    "end_date" "date",
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "image_url" character varying,
    CONSTRAINT "rsf_championships_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['active'::character varying, 'finished'::character varying, 'cancelled'::character varying])::"text"[])))
);


ALTER TABLE "public"."rsf_championships" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."rsf_championships_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."rsf_championships_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."rsf_championships_id_seq" OWNED BY "public"."rsf_championships"."id";



CREATE TABLE IF NOT EXISTS "public"."rsf_pilots" (
    "id" integer NOT NULL,
    "userid" integer NOT NULL,
    "username" character varying(100) NOT NULL,
    "real_name" character varying(200),
    "nationality" character(2) NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."rsf_pilots" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."rsf_pilots_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."rsf_pilots_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."rsf_pilots_id_seq" OWNED BY "public"."rsf_pilots"."id";



CREATE TABLE IF NOT EXISTS "public"."rsf_rallies" (
    "id" integer NOT NULL,
    "championship_id" integer,
    "name" character varying(200) NOT NULL,
    "location" character varying(100),
    "rally_date" "date" NOT NULL,
    "rsf_rally" character varying NOT NULL,
    "status" character varying(20) DEFAULT 'scheduled'::character varying,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "rsf_rallies_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['scheduled'::character varying, 'ongoing'::character varying, 'finished'::character varying, 'cancelled'::character varying])::"text"[])))
);


ALTER TABLE "public"."rsf_rallies" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."rsf_rallies_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."rsf_rallies_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."rsf_rallies_id_seq" OWNED BY "public"."rsf_rallies"."id";



CREATE TABLE IF NOT EXISTS "public"."rsf_rally_points" (
    "id" integer NOT NULL,
    "rally_id" integer,
    "pilot_id" integer,
    "overall_position" integer NOT NULL,
    "total_time" interval NOT NULL,
    "points_earned" integer DEFAULT 0,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."rsf_rally_points" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."rsf_rally_points_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."rsf_rally_points_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."rsf_rally_points_id_seq" OWNED BY "public"."rsf_rally_points"."id";



CREATE TABLE IF NOT EXISTS "public"."rsf_stage_results" (
    "id" integer NOT NULL,
    "stage_id" integer,
    "pilot_id" integer,
    "car_id" integer,
    "position" integer NOT NULL,
    "stage_time" interval NOT NULL,
    "penalty_time" interval DEFAULT '00:00:00'::interval,
    "super_rally" boolean DEFAULT false,
    "dnf" boolean DEFAULT false,
    "dsq" boolean DEFAULT false,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."rsf_stage_results" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."rsf_stage_results_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."rsf_stage_results_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."rsf_stage_results_id_seq" OWNED BY "public"."rsf_stage_results"."id";



CREATE TABLE IF NOT EXISTS "public"."rsf_stages" (
    "id" integer NOT NULL,
    "rally_id" integer,
    "stage_name" character varying(100) NOT NULL,
    "stage_number" integer NOT NULL,
    "distance_km" numeric(6,3),
    "stage_type" character varying(20) DEFAULT 'special'::character varying,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "rsf_stages_stage_type_check" CHECK ((("stage_type")::"text" = ANY ((ARRAY['special'::character varying, 'super_special'::character varying, 'power_stage'::character varying])::"text"[])))
);


ALTER TABLE "public"."rsf_stages" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."rsf_stages_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."rsf_stages_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."rsf_stages_id_seq" OWNED BY "public"."rsf_stages"."id";



CREATE TABLE IF NOT EXISTS "public"."rsf_wrc_points_system" (
    "position" integer NOT NULL,
    "points" integer NOT NULL
);


ALTER TABLE "public"."rsf_wrc_points_system" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_rsf_championship_current_standings" AS
 SELECT "cs"."championship_id",
    "c"."name" AS "championship_name",
    "cs"."current_position",
    "p"."username",
    "p"."real_name",
    "p"."nationality",
    "cs"."total_points",
    "cs"."rallies_completed",
    "cs"."wins",
    "cs"."podiums"
   FROM (("public"."rsf_championship_standings" "cs"
     JOIN "public"."rsf_pilots" "p" ON (("cs"."pilot_id" = "p"."userid")))
     JOIN "public"."rsf_championships" "c" ON (("cs"."championship_id" = "c"."id")))
  WHERE (("c"."status")::"text" = 'active'::"text")
  ORDER BY "cs"."championship_id", "cs"."total_points" DESC, "cs"."wins" DESC, "cs"."podiums" DESC;


ALTER TABLE "public"."v_rsf_championship_current_standings" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_rsf_pilot_championships" AS
 SELECT "p"."userid",
    "p"."username",
    "p"."real_name",
    "p"."nationality",
    "c"."id" AS "championship_id",
    "c"."name" AS "championship_name",
    "c"."season",
    "c"."status" AS "championship_status",
    "c"."start_date",
    "c"."end_date",
    "cs"."total_points",
    "cs"."rallies_completed",
    "cs"."wins",
    "cs"."podiums",
    "cs"."current_position",
    "cs"."last_updated"
   FROM (("public"."rsf_pilots" "p"
     JOIN "public"."rsf_championship_standings" "cs" ON (("p"."userid" = "cs"."pilot_id")))
     JOIN "public"."rsf_championships" "c" ON (("cs"."championship_id" = "c"."id")))
  ORDER BY "p"."username", "c"."season" DESC, "c"."name";


ALTER TABLE "public"."v_rsf_pilot_championships" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_rsf_rally_detailed_results" AS
 SELECT "r"."name" AS "rally_name",
    "rp"."overall_position",
    "p"."username",
    "p"."real_name",
    "p"."nationality",
    "car"."model" AS "car_model",
    "rp"."total_time",
    "rp"."points_earned",
    "r"."rally_date"
   FROM (((("public"."rsf_rally_points" "rp"
     JOIN "public"."rsf_rallies" "r" ON (("rp"."rally_id" = "r"."id")))
     JOIN "public"."rsf_pilots" "p" ON (("rp"."pilot_id" = "p"."userid")))
     JOIN "public"."rsf_stage_results" "sr" ON ((("sr"."pilot_id" = "p"."userid") AND ("sr"."stage_id" IN ( SELECT "rsf_stages"."id"
           FROM "public"."rsf_stages"
          WHERE ("rsf_stages"."rally_id" = "r"."id")
         LIMIT 1)))))
     JOIN "public"."rsf_cars" "car" ON (("sr"."car_id" = "car"."id")))
  ORDER BY "r"."rally_date" DESC, "rp"."overall_position";


ALTER TABLE "public"."v_rsf_rally_detailed_results" OWNER TO "postgres";


ALTER TABLE ONLY "public"."rsf_cars" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."rsf_cars_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."rsf_championship_standings" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."rsf_championship_standings_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."rsf_championships" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."rsf_championships_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."rsf_pilots" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."rsf_pilots_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."rsf_rallies" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."rsf_rallies_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."rsf_rally_points" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."rsf_rally_points_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."rsf_stage_results" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."rsf_stage_results_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."rsf_stages" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."rsf_stages_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."rsf-results"
    ADD CONSTRAINT "rsf-results_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rsf-users"
    ADD CONSTRAINT "rsf-users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rsf-users"
    ADD CONSTRAINT "rsf-users_rsf_id_key" UNIQUE ("rsf_id");



ALTER TABLE ONLY "public"."rsf_cars"
    ADD CONSTRAINT "rsf_cars_model_key" UNIQUE ("model");



ALTER TABLE ONLY "public"."rsf_cars"
    ADD CONSTRAINT "rsf_cars_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rsf_championship_standings"
    ADD CONSTRAINT "rsf_championship_standings_championship_id_pilot_id_key" UNIQUE ("championship_id", "pilot_id");



ALTER TABLE ONLY "public"."rsf_championship_standings"
    ADD CONSTRAINT "rsf_championship_standings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rsf_championships"
    ADD CONSTRAINT "rsf_championships_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rsf-online-rally"
    ADD CONSTRAINT "rsf_online_rally_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rsf_pilots"
    ADD CONSTRAINT "rsf_pilots_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rsf_pilots"
    ADD CONSTRAINT "rsf_pilots_userid_key" UNIQUE ("userid");



ALTER TABLE ONLY "public"."rsf_rallies"
    ADD CONSTRAINT "rsf_rallies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rsf_rally_points"
    ADD CONSTRAINT "rsf_rally_points_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rsf_rally_points"
    ADD CONSTRAINT "rsf_rally_points_rally_id_pilot_id_key" UNIQUE ("rally_id", "pilot_id");



ALTER TABLE ONLY "public"."rsf_stage_results"
    ADD CONSTRAINT "rsf_stage_results_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rsf_stage_results"
    ADD CONSTRAINT "rsf_stage_results_stage_id_pilot_id_key" UNIQUE ("stage_id", "pilot_id");



ALTER TABLE ONLY "public"."rsf_stages"
    ADD CONSTRAINT "rsf_stages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rsf_stages"
    ADD CONSTRAINT "rsf_stages_rally_id_stage_number_key" UNIQUE ("rally_id", "stage_number");



ALTER TABLE ONLY "public"."rsf_wrc_points_system"
    ADD CONSTRAINT "rsf_wrc_points_system_pkey" PRIMARY KEY ("position");



CREATE INDEX "idx_rsf_championship_standings_points" ON "public"."rsf_championship_standings" USING "btree" ("championship_id", "total_points" DESC);



CREATE INDEX "idx_rsf_pilots_nationality" ON "public"."rsf_pilots" USING "btree" ("nationality");



CREATE INDEX "idx_rsf_rally_points_position" ON "public"."rsf_rally_points" USING "btree" ("overall_position");



CREATE INDEX "idx_rsf_rally_points_rally" ON "public"."rsf_rally_points" USING "btree" ("rally_id");



CREATE INDEX "idx_rsf_stage_results_position" ON "public"."rsf_stage_results" USING "btree" ("position");



CREATE INDEX "idx_rsf_stage_results_stage_pilot" ON "public"."rsf_stage_results" USING "btree" ("stage_id", "pilot_id");



ALTER TABLE ONLY "public"."rsf-results"
    ADD CONSTRAINT "rsf-results_rsf_rally_fkey" FOREIGN KEY ("rsf_rally") REFERENCES "public"."rsf-online-rally"("id");



ALTER TABLE ONLY "public"."rsf_championship_standings"
    ADD CONSTRAINT "rsf_championship_standings_championship_id_fkey" FOREIGN KEY ("championship_id") REFERENCES "public"."rsf_championships"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."rsf_championship_standings"
    ADD CONSTRAINT "rsf_championship_standings_pilot_id_fkey" FOREIGN KEY ("pilot_id") REFERENCES "public"."rsf_pilots"("userid") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."rsf_rallies"
    ADD CONSTRAINT "rsf_rallies_championship_id_fkey" FOREIGN KEY ("championship_id") REFERENCES "public"."rsf_championships"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."rsf_rally_points"
    ADD CONSTRAINT "rsf_rally_points_pilot_id_fkey" FOREIGN KEY ("pilot_id") REFERENCES "public"."rsf_pilots"("userid") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."rsf_rally_points"
    ADD CONSTRAINT "rsf_rally_points_rally_id_fkey" FOREIGN KEY ("rally_id") REFERENCES "public"."rsf_rallies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."rsf_stage_results"
    ADD CONSTRAINT "rsf_stage_results_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "public"."rsf_cars"("id");



ALTER TABLE ONLY "public"."rsf_stage_results"
    ADD CONSTRAINT "rsf_stage_results_pilot_id_fkey" FOREIGN KEY ("pilot_id") REFERENCES "public"."rsf_pilots"("userid") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."rsf_stage_results"
    ADD CONSTRAINT "rsf_stage_results_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "public"."rsf_stages"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."rsf_stages"
    ADD CONSTRAINT "rsf_stages_rally_id_fkey" FOREIGN KEY ("rally_id") REFERENCES "public"."rsf_rallies"("id") ON DELETE CASCADE;



CREATE POLICY "Enable insert for authenticated users only" ON "public"."rsf-online-rally" FOR INSERT TO "authenticated", "supabase_admin" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."rsf-results" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."rsf-users" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."rsf_cars" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."rsf_championship_standings" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."rsf_championships" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."rsf_pilots" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."rsf_rallies" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."rsf_rally_points" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."rsf_stage_results" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."rsf_stages" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable read access for all users" ON "public"."rsf-online-rally" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."rsf-results" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."rsf-users" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."rsf_cars" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."rsf_championship_standings" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."rsf_championships" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."rsf_pilots" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."rsf_rallies" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."rsf_rally_points" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."rsf_stage_results" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."rsf_stages" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."rsf_wrc_points_system" FOR SELECT USING (true);



CREATE POLICY "Enable update for users based on email" ON "public"."rsf_pilots" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "Update" ON "public"."rsf-online-rally" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "Update" ON "public"."rsf-results" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "Update" ON "public"."rsf_championship_standings" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "Update" ON "public"."rsf_championships" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "Update" ON "public"."rsf_rallies" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "Update" ON "public"."rsf_rally_points" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "Update" ON "public"."rsf_stage_results" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "Update" ON "public"."rsf_stages" FOR UPDATE TO "authenticated" USING (true);



ALTER TABLE "public"."rsf-online-rally" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."rsf-results" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."rsf-users" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."rsf_cars" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."rsf_championship_standings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."rsf_championships" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."rsf_pilots" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."rsf_rallies" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."rsf_rally_points" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."rsf_stage_results" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."rsf_stages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."rsf_wrc_points_system" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "update" ON "public"."rsf-users" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "update" ON "public"."rsf_cars" FOR UPDATE TO "authenticated" USING (true);





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";











































































































































































GRANT ALL ON FUNCTION "public"."update_championship_standings"("p_championship_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."update_championship_standings"("p_championship_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_championship_standings"("p_championship_id" integer) TO "service_role";


















GRANT ALL ON TABLE "public"."rsf-online-rally" TO "anon";
GRANT ALL ON TABLE "public"."rsf-online-rally" TO "authenticated";
GRANT ALL ON TABLE "public"."rsf-online-rally" TO "service_role";



GRANT ALL ON TABLE "public"."rsf-results" TO "anon";
GRANT ALL ON TABLE "public"."rsf-results" TO "authenticated";
GRANT ALL ON TABLE "public"."rsf-results" TO "service_role";



GRANT ALL ON TABLE "public"."rsf-users" TO "anon";
GRANT ALL ON TABLE "public"."rsf-users" TO "authenticated";
GRANT ALL ON TABLE "public"."rsf-users" TO "service_role";



GRANT ALL ON TABLE "public"."rsf_cars" TO "anon";
GRANT ALL ON TABLE "public"."rsf_cars" TO "authenticated";
GRANT ALL ON TABLE "public"."rsf_cars" TO "service_role";



GRANT ALL ON SEQUENCE "public"."rsf_cars_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."rsf_cars_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."rsf_cars_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."rsf_championship_standings" TO "anon";
GRANT ALL ON TABLE "public"."rsf_championship_standings" TO "authenticated";
GRANT ALL ON TABLE "public"."rsf_championship_standings" TO "service_role";



GRANT ALL ON SEQUENCE "public"."rsf_championship_standings_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."rsf_championship_standings_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."rsf_championship_standings_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."rsf_championships" TO "anon";
GRANT ALL ON TABLE "public"."rsf_championships" TO "authenticated";
GRANT ALL ON TABLE "public"."rsf_championships" TO "service_role";



GRANT ALL ON SEQUENCE "public"."rsf_championships_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."rsf_championships_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."rsf_championships_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."rsf_pilots" TO "anon";
GRANT ALL ON TABLE "public"."rsf_pilots" TO "authenticated";
GRANT ALL ON TABLE "public"."rsf_pilots" TO "service_role";



GRANT ALL ON SEQUENCE "public"."rsf_pilots_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."rsf_pilots_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."rsf_pilots_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."rsf_rallies" TO "anon";
GRANT ALL ON TABLE "public"."rsf_rallies" TO "authenticated";
GRANT ALL ON TABLE "public"."rsf_rallies" TO "service_role";



GRANT ALL ON SEQUENCE "public"."rsf_rallies_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."rsf_rallies_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."rsf_rallies_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."rsf_rally_points" TO "anon";
GRANT ALL ON TABLE "public"."rsf_rally_points" TO "authenticated";
GRANT ALL ON TABLE "public"."rsf_rally_points" TO "service_role";



GRANT ALL ON SEQUENCE "public"."rsf_rally_points_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."rsf_rally_points_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."rsf_rally_points_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."rsf_stage_results" TO "anon";
GRANT ALL ON TABLE "public"."rsf_stage_results" TO "authenticated";
GRANT ALL ON TABLE "public"."rsf_stage_results" TO "service_role";



GRANT ALL ON SEQUENCE "public"."rsf_stage_results_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."rsf_stage_results_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."rsf_stage_results_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."rsf_stages" TO "anon";
GRANT ALL ON TABLE "public"."rsf_stages" TO "authenticated";
GRANT ALL ON TABLE "public"."rsf_stages" TO "service_role";



GRANT ALL ON SEQUENCE "public"."rsf_stages_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."rsf_stages_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."rsf_stages_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."rsf_wrc_points_system" TO "anon";
GRANT ALL ON TABLE "public"."rsf_wrc_points_system" TO "authenticated";
GRANT ALL ON TABLE "public"."rsf_wrc_points_system" TO "service_role";



GRANT ALL ON TABLE "public"."v_rsf_championship_current_standings" TO "anon";
GRANT ALL ON TABLE "public"."v_rsf_championship_current_standings" TO "authenticated";
GRANT ALL ON TABLE "public"."v_rsf_championship_current_standings" TO "service_role";



GRANT ALL ON TABLE "public"."v_rsf_pilot_championships" TO "anon";
GRANT ALL ON TABLE "public"."v_rsf_pilot_championships" TO "authenticated";
GRANT ALL ON TABLE "public"."v_rsf_pilot_championships" TO "service_role";



GRANT ALL ON TABLE "public"."v_rsf_rally_detailed_results" TO "anon";
GRANT ALL ON TABLE "public"."v_rsf_rally_detailed_results" TO "authenticated";
GRANT ALL ON TABLE "public"."v_rsf_rally_detailed_results" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
