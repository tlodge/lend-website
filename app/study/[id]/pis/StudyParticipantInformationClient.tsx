"use client";

import { useRouter } from "next/navigation";
import { ParticipantInformationScreen } from "../components/RemoteEntry";

type StudyParticipantInformationClientProps = {
  id: string;
};

export default function StudyParticipantInformationClient({ id }: StudyParticipantInformationClientProps) {
  const router = useRouter();
  const studyBasePath = `/study/${id}`;

  return (
    <ParticipantInformationScreen
      onBack={() => router.push(studyBasePath)}
      onGoToStudy={() => router.push(studyBasePath)}
    />
  );
}