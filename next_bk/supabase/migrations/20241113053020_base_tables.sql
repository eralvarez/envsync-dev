create table "public"."project" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "name" text not null,
    "description" text,
    "created_by" uuid
);


create table "public"."project_env" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "project_id" uuid not null,
    "name" text not null,
    "created_by" uuid not null
);


create table "public"."project_env_var" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "project_env_id" uuid not null,
    "env_var" text not null,
    "value" text not null
);


CREATE UNIQUE INDEX project_env_pkey ON public.project_env USING btree (id);

CREATE UNIQUE INDEX project_env_var_pkey ON public.project_env_var USING btree (id);

CREATE UNIQUE INDEX project_pkey ON public.project USING btree (id);

alter table "public"."project" add constraint "project_pkey" PRIMARY KEY using index "project_pkey";

alter table "public"."project_env" add constraint "project_env_pkey" PRIMARY KEY using index "project_env_pkey";

alter table "public"."project_env_var" add constraint "project_env_var_pkey" PRIMARY KEY using index "project_env_var_pkey";

alter table "public"."project" add constraint "project_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."project" validate constraint "project_created_by_fkey";

alter table "public"."project_env" add constraint "project_env_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."project_env" validate constraint "project_env_created_by_fkey";

alter table "public"."project_env" add constraint "project_env_project_id_fkey" FOREIGN KEY (project_id) REFERENCES project(id) not valid;

alter table "public"."project_env" validate constraint "project_env_project_id_fkey";

alter table "public"."project_env_var" add constraint "project_env_var_project_env_id_fkey" FOREIGN KEY (project_env_id) REFERENCES project_env(id) not valid;

alter table "public"."project_env_var" validate constraint "project_env_var_project_env_id_fkey";

grant delete on table "public"."project" to "anon";

grant insert on table "public"."project" to "anon";

grant references on table "public"."project" to "anon";

grant select on table "public"."project" to "anon";

grant trigger on table "public"."project" to "anon";

grant truncate on table "public"."project" to "anon";

grant update on table "public"."project" to "anon";

grant delete on table "public"."project" to "authenticated";

grant insert on table "public"."project" to "authenticated";

grant references on table "public"."project" to "authenticated";

grant select on table "public"."project" to "authenticated";

grant trigger on table "public"."project" to "authenticated";

grant truncate on table "public"."project" to "authenticated";

grant update on table "public"."project" to "authenticated";

grant delete on table "public"."project" to "service_role";

grant insert on table "public"."project" to "service_role";

grant references on table "public"."project" to "service_role";

grant select on table "public"."project" to "service_role";

grant trigger on table "public"."project" to "service_role";

grant truncate on table "public"."project" to "service_role";

grant update on table "public"."project" to "service_role";

grant delete on table "public"."project_env" to "anon";

grant insert on table "public"."project_env" to "anon";

grant references on table "public"."project_env" to "anon";

grant select on table "public"."project_env" to "anon";

grant trigger on table "public"."project_env" to "anon";

grant truncate on table "public"."project_env" to "anon";

grant update on table "public"."project_env" to "anon";

grant delete on table "public"."project_env" to "authenticated";

grant insert on table "public"."project_env" to "authenticated";

grant references on table "public"."project_env" to "authenticated";

grant select on table "public"."project_env" to "authenticated";

grant trigger on table "public"."project_env" to "authenticated";

grant truncate on table "public"."project_env" to "authenticated";

grant update on table "public"."project_env" to "authenticated";

grant delete on table "public"."project_env" to "service_role";

grant insert on table "public"."project_env" to "service_role";

grant references on table "public"."project_env" to "service_role";

grant select on table "public"."project_env" to "service_role";

grant trigger on table "public"."project_env" to "service_role";

grant truncate on table "public"."project_env" to "service_role";

grant update on table "public"."project_env" to "service_role";

grant delete on table "public"."project_env_var" to "anon";

grant insert on table "public"."project_env_var" to "anon";

grant references on table "public"."project_env_var" to "anon";

grant select on table "public"."project_env_var" to "anon";

grant trigger on table "public"."project_env_var" to "anon";

grant truncate on table "public"."project_env_var" to "anon";

grant update on table "public"."project_env_var" to "anon";

grant delete on table "public"."project_env_var" to "authenticated";

grant insert on table "public"."project_env_var" to "authenticated";

grant references on table "public"."project_env_var" to "authenticated";

grant select on table "public"."project_env_var" to "authenticated";

grant trigger on table "public"."project_env_var" to "authenticated";

grant truncate on table "public"."project_env_var" to "authenticated";

grant update on table "public"."project_env_var" to "authenticated";

grant delete on table "public"."project_env_var" to "service_role";

grant insert on table "public"."project_env_var" to "service_role";

grant references on table "public"."project_env_var" to "service_role";

grant select on table "public"."project_env_var" to "service_role";

grant trigger on table "public"."project_env_var" to "service_role";

grant truncate on table "public"."project_env_var" to "service_role";

grant update on table "public"."project_env_var" to "service_role";


