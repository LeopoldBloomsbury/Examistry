export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-100">
      <main className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-12 lg:px-10">
        <div className="grid w-full gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[32px] bg-zinc-950 p-8 text-white">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">CertKit</p>
            <h1 className="mt-6 font-serif text-4xl">A cleaner account experience for serious study.</h1>
            <p className="mt-4 text-sm leading-7 text-zinc-300">
              Magic-link authentication, entitlement reconciliation, and dashboard access all flow through Supabase Auth.
            </p>
          </div>
          <div className="flex items-center">{children}</div>
        </div>
      </main>
    </div>
  );
}
