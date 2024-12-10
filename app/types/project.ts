import { QueryData } from "@supabase/supabase-js";

import { createClient as createClientClient } from "utils/supabase/client";

const supabaseClient = await createClientClient();

const getProjectWithEnvQuery = supabaseClient
  .from("project")
  .select("*, project_envs:project_env(*)")
  .single();

type ProjectWithEnv = QueryData<typeof getProjectWithEnvQuery>;

export type { ProjectWithEnv };
