import ProjectEnvPage from "./ProjectEnvPage";

export default async function ProjectEnvironmentPage({
  params,
}: {
  params: Promise<{ projectId: string; projectEnvId: string }>;
}) {
  const { projectId, projectEnvId } = await params;

  return <ProjectEnvPage projectId={projectId} projectEnvId={projectEnvId} />;
}
