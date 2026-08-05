import { VerifyEmailView } from "@/features/auth";

export default async function VerifyEmailPage({ searchParams }: PageProps<"/verificar-email">) {
  const value = (await searchParams).token;
  const token = typeof value === "string" ? value : undefined;
  return <VerifyEmailView token={token} />;
}
