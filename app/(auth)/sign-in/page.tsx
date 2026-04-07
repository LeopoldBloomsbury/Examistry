import { AuthForm } from "@/components/forms/auth-form";

export default async function SignInPage({
  searchParams
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return <AuthForm mode="sign-in" nextPath={next ?? "/dashboard"} />;
}
