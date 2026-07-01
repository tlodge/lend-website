import StudyParticipantInformationClient from "./StudyParticipantInformationClient";

type StudyParticipantInformationPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function StudyParticipantInformationPage({ params }: StudyParticipantInformationPageProps) {
  const { id } = await params;

  return <StudyParticipantInformationClient id={id} />;
}