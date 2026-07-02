import PrototypeApp from "../components/PrototypeApp";

type InPersonStudyPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function InPersonStudyPage({ params }: InPersonStudyPageProps) {
  const { id } = await params;

  return <PrototypeApp deploymentMode="inperson" studyId={id} />;
}