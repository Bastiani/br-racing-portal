-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.rsf-championship-standings (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  rsf_user_id uuid,
  rsf_results_championship_id uuid,
  points numeric DEFAULT 0,
  championship_id uuid,
  total_points numeric DEFAULT 0,
  position_in_championship integer,
  CONSTRAINT rsf-championship-standings_pkey PRIMARY KEY (id),
  CONSTRAINT rsf-championship-standings_rsf_user_id_fkey FOREIGN KEY (rsf_user_id) REFERENCES public.rsf-users(id),
  CONSTRAINT rsf-championship-standings_rsf_results_championship_id_fkey FOREIGN KEY (rsf_results_championship_id) REFERENCES public.rsf-results-championship(id),
  CONSTRAINT rsf-championship-standings_championship_id_fkey FOREIGN KEY (championship_id) REFERENCES public.rsf-custom-championship(id)
);
CREATE TABLE public.rsf-custom-championship (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  championship_name text,
  rally_id numeric,
  is_active boolean DEFAULT true,
  CONSTRAINT rsf-custom-championship_pkey PRIMARY KEY (id)
);
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
CREATE TABLE public.rsf-results-championship (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  position bigint,
  userid bigint NOT NULL,
  user_name text,
  real_name text,
  nationality text,
  car text,
  time3 text,
  super_rally text,
  penalty text,
  rsf_rally uuid,
  points numeric DEFAULT 0,
  rally_date timestamp with time zone DEFAULT now(),
  rsf_rally_id bigint,
  CONSTRAINT rsf-results-championship_pkey PRIMARY KEY (id),
  CONSTRAINT rsf-results-championship_rsf_rally_fkey FOREIGN KEY (rsf_rally) REFERENCES public.rsf-custom-championship(id),
  CONSTRAINT rsf-results-championship_userid_fkey FOREIGN KEY (userid) REFERENCES public.rsf-users(rsf_id)
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
CREATE TABLE public.wrc-points-system (
  position integer NOT NULL,
  points integer NOT NULL,
  CONSTRAINT wrc-points-system_pkey PRIMARY KEY (position)
);