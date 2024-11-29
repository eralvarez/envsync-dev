import { NextResponse } from "next/server";

import { createClient } from "utils/supabase/server";
import { decryptString } from "services/CryptoService";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const supabase = await createClient();
  const slug = (await params).slug;
  const [projectId, projectEnvId] = slug.split(":");

  const { data: projectEnvVars, error } = await supabase
    .from("project_env_var")
    .select("env_var, value")
    .eq("project_id", projectId)
    .eq("project_env_id", projectEnvId);

  if (Boolean(error)) {
    console.group("[ERROR] /api/env/:id");
    console.log(error);
    console.groupEnd();
    return NextResponse.json([]);
  }

  return NextResponse.json(
    projectEnvVars?.map((envVar) => ({
      ...envVar,
      value: decryptString(envVar.value),
    }))
  );
}
