export const metadata = {
  title: "Offline",
}

export default function OfflinePage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="text-lg font-semibold">You are offline</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        VisualCNS needs a connection to load this page. Check your network and try again.
      </p>
    </main>
  )
}
