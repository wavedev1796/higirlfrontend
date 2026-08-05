import { ChatView } from "@/features/chat";

export default async function ChatsPage({ searchParams }: PageProps<"/chats">) {
  const value = (await searchParams).participante;
  const participantId = typeof value === "string" ? Number(value) : undefined;

  return (
    <ChatView
      initialParticipantId={
        typeof participantId === "number" &&
        Number.isInteger(participantId) &&
        participantId > 0
          ? participantId
          : undefined
      }
    />
  );
}
