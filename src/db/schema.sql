-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.rsf-online-rally (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  rally_name text NOT NULL,
  rally_id numeric,
  CONSTRAINT rsf-online-rally_pkey PRIMARY KEY (id)
);
CREATE TABLE public.rsf-results (
  position bigint,
  userid bigint NOT NULL,
  user_name text,
  real_name text,
  nationality text,
  car text,
  time3 text,
  super_rally text,
  penalty text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  rsf_rally uuid,
  CONSTRAINT rsf-results_pkey PRIMARY KEY (id),
  CONSTRAINT rsf-results_rsf_rally_fkey FOREIGN KEY (rsf_rally) REFERENCES public.rsf-online-rally(id)
);
CREATE TABLE public.rsf-users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name character varying,
  victories bigint,
  nationality character varying,
  rsf_id bigint NOT NULL UNIQUE,
  first bigint,
  second bigint,
  third bigint,
  CONSTRAINT rsf-users_pkey PRIMARY KEY (id)
);
CREATE TABLE public.rsf_cars (
  id integer NOT NULL DEFAULT nextval('rsf_cars_id_seq'::regclass),
  model character varying NOT NULL UNIQUE,
  category character varying DEFAULT 'R2'::character varying,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT rsf_cars_pkey PRIMARY KEY (id)
);
CREATE TABLE public.rsf_championship_standings (
  id integer NOT NULL DEFAULT nextval('rsf_championship_standings_id_seq'::regclass),
  championship_id integer,
  pilot_id integer,
  total_points integer DEFAULT 0,
  rallies_completed integer DEFAULT 0,
  wins integer DEFAULT 0,
  podiums integer DEFAULT 0,
  current_position integer,
  last_updated timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT rsf_championship_standings_pkey PRIMARY KEY (id),
  CONSTRAINT rsf_championship_standings_championship_id_fkey FOREIGN KEY (championship_id) REFERENCES public.rsf_championships(id),
  CONSTRAINT rsf_championship_standings_pilot_id_fkey FOREIGN KEY (pilot_id) REFERENCES public.rsf_pilots(userid)
);
CREATE TABLE public.rsf_championships (
  id integer NOT NULL DEFAULT nextval('rsf_championships_id_seq'::regclass),
  name character varying NOT NULL,
  season integer NOT NULL,
  status character varying DEFAULT 'active'::character varying CHECK (status::text = ANY (ARRAY['active'::character varying, 'finished'::character varying, 'cancelled'::character varying]::text[])),
  start_date date,
  end_date date,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT rsf_championships_pkey PRIMARY KEY (id)
);
CREATE TABLE public.rsf_pilots (
  id integer NOT NULL DEFAULT nextval('rsf_pilots_id_seq'::regclass),
  userid integer NOT NULL UNIQUE,
  username character varying NOT NULL,
  real_name character varying,
  nationality character NOT NULL,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT rsf_pilots_pkey PRIMARY KEY (id)
);
CREATE TABLE public.rsf_rallies (
  id integer NOT NULL DEFAULT nextval('rsf_rallies_id_seq'::regclass),
  championship_id integer,
  name character varying NOT NULL,
  location character varying,
  rally_date date NOT NULL,
  rsf_rally uuid NOT NULL,
  status character varying DEFAULT 'scheduled'::character varying CHECK (status::text = ANY (ARRAY['scheduled'::character varying, 'ongoing'::character varying, 'finished'::character varying, 'cancelled'::character varying]::text[])),
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT rsf_rallies_pkey PRIMARY KEY (id),
  CONSTRAINT rsf_rallies_championship_id_fkey FOREIGN KEY (championship_id) REFERENCES public.rsf_championships(id)
);
CREATE TABLE public.rsf_rally_points (
  id integer NOT NULL DEFAULT nextval('rsf_rally_points_id_seq'::regclass),
  rally_id integer,
  pilot_id integer,
  overall_position integer NOT NULL,
  total_time interval NOT NULL,
  points_earned integer DEFAULT 0,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT rsf_rally_points_pkey PRIMARY KEY (id),
  CONSTRAINT rsf_rally_points_pilot_id_fkey FOREIGN KEY (pilot_id) REFERENCES public.rsf_pilots(userid),
  CONSTRAINT rsf_rally_points_rally_id_fkey FOREIGN KEY (rally_id) REFERENCES public.rsf_rallies(id)
);
CREATE TABLE public.rsf_stage_results (
  id integer NOT NULL DEFAULT nextval('rsf_stage_results_id_seq'::regclass),
  stage_id integer,
  pilot_id integer,
  car_id integer,
  position integer NOT NULL,
  stage_time interval NOT NULL,
  penalty_time interval DEFAULT '00:00:00'::interval,
  super_rally boolean DEFAULT false,
  dnf boolean DEFAULT false,
  dsq boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT rsf_stage_results_pkey PRIMARY KEY (id),
  CONSTRAINT rsf_stage_results_stage_id_fkey FOREIGN KEY (stage_id) REFERENCES public.rsf_stages(id),
  CONSTRAINT rsf_stage_results_pilot_id_fkey FOREIGN KEY (pilot_id) REFERENCES public.rsf_pilots(userid),
  CONSTRAINT rsf_stage_results_car_id_fkey FOREIGN KEY (car_id) REFERENCES public.rsf_cars(id)
);
CREATE TABLE public.rsf_stages (
  id integer NOT NULL DEFAULT nextval('rsf_stages_id_seq'::regclass),
  rally_id integer,
  stage_name character varying NOT NULL,
  stage_number integer NOT NULL,
  distance_km numeric,
  stage_type character varying DEFAULT 'special'::character varying CHECK (stage_type::text = ANY (ARRAY['special'::character varying, 'super_special'::character varying, 'power_stage'::character varying]::text[])),
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT rsf_stages_pkey PRIMARY KEY (id),
  CONSTRAINT rsf_stages_rally_id_fkey FOREIGN KEY (rally_id) REFERENCES public.rsf_rallies(id)
);
CREATE TABLE public.rsf_wrc_points_system (
  position integer NOT NULL,
  points integer NOT NULL,
  CONSTRAINT rsf_wrc_points_system_pkey PRIMARY KEY (position)
);