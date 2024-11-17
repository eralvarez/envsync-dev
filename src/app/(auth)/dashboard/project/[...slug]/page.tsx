import ProjectEnvPage from "./ProjectEnvPage";

export default async function ProjectEnvironmentPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const [projectId, projectEnvId] = (await params).slug;

  return <ProjectEnvPage projectId={projectId} projectEnvId={projectEnvId} />;
}
