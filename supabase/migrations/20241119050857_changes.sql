alter table "public"."project_env_var" add column "project_id" uuid;

alter table "public"."project_env_var" add constraint "project_env_var_project_id_fkey" FOREIGN KEY (project_id) REFERENCES project(id) not valid;

alter table "public"."project_env_var" validate constraint "project_env_var_project_id_fkey";


