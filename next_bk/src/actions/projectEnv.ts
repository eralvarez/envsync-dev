"use server";

import { createClient } from "utils/supabase/server";
import { ActionResponse } from "types/actionResponse";

const createProjectEnvAction = async ({
  name,
  projectId,
}: {
  name: string;
  projectId: string;
}): Promise<ActionResponse> => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error: createProjectEnvVarsError } = await supabase
      .from("project_env")
      .insert({
        name,
        project_id: projectId,
        created_by: user?.id as string,
      });

    return {
      data: null,
      error: createProjectEnvVarsError,
    };
  } catch (error) {
    console.group("createProjectEnvAction action:");
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

const deleteProjectEnvAction = async ({
  projectId,
  projectEnvId,
}: {
  projectId: string;
  projectEnvId: string;
}): Promise<ActionResponse> => {
  try {
    const supabase = await createClient();

    const { error: deleteProjectEnvError } = await supabase
      .from("project_env")
      .delete()
      .eq("id", projectEnvId)
      .eq("project_id", projectId);

    return {
      data: null,
      error: deleteProjectEnvError,
    };
  } catch (error) {
    console.group("deleteProjectEnvAction action:");
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

export { createProjectEnvAction, deleteProjectEnvAction };
