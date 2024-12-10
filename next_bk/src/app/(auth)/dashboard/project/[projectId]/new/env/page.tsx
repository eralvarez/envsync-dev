import NewEnvPage from "./NewEnvPage";

export default async function ProjectEnvironmentPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const projectId = (await params).projectId;

  return <NewEnvPage projectId={projectId} />;
}
