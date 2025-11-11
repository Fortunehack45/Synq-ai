
export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)]"></div>
       <div className="absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2">
        <div className="animate-blob h-[30rem] w-[30rem] rounded-full bg-primary/20 blur-3xl filter" />
      </div>
      {children}
    </div>
  );
}
