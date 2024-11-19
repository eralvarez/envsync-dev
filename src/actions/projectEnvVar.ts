"use server";

import { createClient } from "utils/supabase/server";
import { ActionResponse } from "types/actionResponse";
import { Database } from "types/supabase";
import { encryptString, decryptString } from "services/crypto";

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

    const envVars: any[] = [];

    projectEnvVars?.forEach((envVar) => {
      const decryptedValue = decryptString(envVar.value);
      envVars.push({
        ...envVar,
        value: decryptedValue,
      });
    });

    return {
      data: envVars ?? [],
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

    const valuesToInsert: any[] = [];
    envVars.forEach(async ([envVar, value]) => {
      const encryptedValue = await encryptString(value);

      valuesToInsert.push({
        env_var: envVar,
        value: encryptedValue,
        project_id: projectId,
        project_env_id: projectEnvId,
      });
    });

    const { error: createProjectEnvVarsError } = await supabase
      .from("project_env_var")
      .insert(valuesToInsert);

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

    const envVarValue = await encryptString(projectEnvVar.value);

    const { error: editProjectEnvVarsError } = await supabase
      .from("project_env_var")
      .update({
        env_var: projectEnvVar.env_var,
        value: envVarValue,
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
