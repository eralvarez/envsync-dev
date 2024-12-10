"use server";

import { createClient } from "utils/supabase/server";
import { ActionResponse } from "types/actionResponse";
import { Database } from "types/supabase";
import { encryptString, decryptString } from "services/CryptoService";

const getAllProjectEnvVarsAction = async ({
  projectId,
  projectEnvId,
}: {
  projectId: string;
  projectEnvId: string;
}): Promise<
  ActionResponse<
    Database["public"]["Tables"]["project_env_var"]["Row"][] | null
  >
> => {
  try {
    const supabase = await createClient();

    const { data: projectEnvVars, error: getProjectEnvVarsError } =
      await supabase
        .from("project_env_var")
        .select("*")
        .eq("project_id", projectId)
        .eq("project_env_id", projectEnvId);

    return {
      data:
        projectEnvVars?.map((envVar) => ({
          ...envVar,
          value: decryptString(envVar.value),
        })) ?? [],
      error: getProjectEnvVarsError,
    };
  } catch (error) {
    console.group("getAllProjectEnvVarsAction action:");
    console.error(error);
    console.groupEnd();

    let errorMessage = "";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      data: null,
      error: errorMessage,
    };
  }
};

const createProjectEnvVarAction = async ({
  envVars,
  projectId,
  projectEnvId,
}: {
  envVars: [string, string][];
  projectId: string;
  projectEnvId: string;
}): Promise<ActionResponse> => {
  try {
    const supabase = await createClient();

    const { error: createProjectEnvVarsError } = await supabase
      .from("project_env_var")
      .insert(
        envVars.map(([envVar, value]) => ({
          env_var: envVar,
          value: encryptString(value),
          project_id: projectId,
          project_env_id: projectEnvId,
        }))
      );

    return {
      data: null,
      error: createProjectEnvVarsError,
    };
  } catch (error) {
    console.group("createProjectEnvVarAction action:");
    console.error(error);
    console.groupEnd();

    let errorMessage = "";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      data: null,
      error: errorMessage,
    };
  }
};

const deleteProjectEnvVarAction = async ({
  projectId,
  projectEnvId,
  projectEnvVarId,
}: {
  projectId: string;
  projectEnvId: string;
  projectEnvVarId: string;
}): Promise<ActionResponse> => {
  try {
    const supabase = await createClient();

    const { error: deleteProjectEnvVarError } = await supabase
      .from("project_env_var")
      .delete()
      .eq("id", projectEnvVarId)
      .eq("project_id", projectId)
      .eq("project_env_id", projectEnvId);

    return {
      data: null,
      error: deleteProjectEnvVarError,
    };
  } catch (error) {
    console.group("deleteProjectEnvVarAction action:");
    console.error(error);
    console.groupEnd();

    let errorMessage = "";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      data: null,
      error: errorMessage,
    };
  }
};

const editProjectEnvVarAction = async ({
  projectEnvVar,
  projectId,
  projectEnvId,
}: {
  projectEnvVar: Pick<
    Database["public"]["Tables"]["project_env_var"]["Row"],
    "id" | "env_var" | "value"
  >;
  projectId: string;
  projectEnvId: string;
}): Promise<ActionResponse> => {
  try {
    const supabase = await createClient();

    const { error: editProjectEnvVarsError } = await supabase
      .from("project_env_var")
      .update({
        env_var: projectEnvVar.env_var,
        value: encryptString(projectEnvVar.value),
      })
      .eq("project_id", projectId)
      .eq("project_env_id", projectEnvId)
      .eq("id", projectEnvVar.id);

    return {
      data: null,
      error: editProjectEnvVarsError,
    };
  } catch (error) {
    console.group("editProjectEnvVarAction action:");
    console.error(error);
    console.groupEnd();

    let errorMessage = "";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      data: null,
      error: errorMessage,
    };
  }
};

export {
  getAllProjectEnvVarsAction,
  createProjectEnvVarAction,
  deleteProjectEnvVarAction,
  editProjectEnvVarAction,
};
