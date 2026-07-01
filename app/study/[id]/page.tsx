import RemoteEntry from "./components/RemoteEntry";

type StudyEntryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function StudyEntryPage({ params }: StudyEntryPageProps) {
  const { id } = await params;

  return <RemoteEntry studyBasePath={`/study/${id}`} />;
}