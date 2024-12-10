"use server";

import { createClient } from "utils/supabase/server";
import { ActionResponse } from "types/actionResponse";
import { ProjectWithEnv } from "types/project";

const createProjectAction = async (formData: {
  name: string;
  description: string;
}): Promise<ActionResponse> => {
  try {
    const { name, description } = formData;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: newProject, error: createProjectError } = await supabase
      .from("project")
      .insert({ name, description, created_by: user?.id })
      .select()
      .single();

    if (!Boolean(createProjectError)) {
      await supabase.from("project_env").insert({
        name: "PROD",
        project_id: newProject?.id as string,
        created_by: user?.id as string,
      });
    }

    return {
      data: null,
      error: createProjectError,
    };
  } catch (error) {
    console.group("createProjectAction action:");
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

const getAllProjectsAction = async (): Promise<
  ActionResponse<ProjectWithEnv[] | null>
> => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: projects, error: getProjectsError } = await supabase
      .from("project")
      .select("*, project_envs:project_env(*)")
      .eq("created_by", user?.id as string);

    return {
      data: projects ?? [],
      error: getProjectsError,
    };
  } catch (error) {
    console.group("getAllProjectsAction action:");
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

export { createProjectAction, getAllProjectsAction };
