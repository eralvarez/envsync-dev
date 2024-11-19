import ProjectEnvPage from "./ProjectEnvPage";

export const runtime = "edge";

export default async function ProjectEnvironmentPage({
  params,
}: {
  params: Promise<{ projectId: string; projectEnvId: string }>;
}) {
  const { projectId, projectEnvId } = await params;

  return <ProjectEnvPage projectId={projectId} projectEnvId={projectEnvId} />;
}
