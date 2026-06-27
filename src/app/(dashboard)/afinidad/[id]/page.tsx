import { AffinityDetail } from "@/features/matching";

interface AffinityPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AffinityPage({ params }: AffinityPageProps) {
  const { id } = await params;

  return <AffinityDetail userId={Number(id)} />;
}
