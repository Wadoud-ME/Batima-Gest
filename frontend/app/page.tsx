import Link from "next/link";
import { Building2, ArrowRight, ShieldCheck, Wrench, Megaphone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden flex flex-col">
      {/* Navbar */}
      <header className="px-6 lg:px-8 py-6 flex items-center justify-between z-10 relative">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Batima-Gest</span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <Link href="/dashboard" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
              Go to Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold hover:text-primary transition-colors">
                Log in
              </Link>
              <Link href="/signup" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all hover:scale-105 active:scale-95">
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 relative isolate">
        {/* Abstract Background Elements */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
              Property Management, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Reimagined.</span>
            </h1>
            <p className="mt-8 text-lg leading-8 text-muted-foreground">
              Batima-Gest brings your building into the digital age. Connect administrators and residents, track maintenance requests, and share important documents seamlessly.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {user ? (
                <Link href="/dashboard" className="rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                  Enter Dashboard <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <>
                  <Link href="/signup" className="rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                    Start for free <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/login" className="text-base font-semibold leading-6 hover:text-primary transition-colors flex items-center gap-2 group">
                    Resident Login <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Feature Cards */}
          <div className="mx-auto mt-24 max-w-7xl sm:mt-32 lg:mt-40">
            <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12">
              <div className="rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                  <Wrench className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">Maintenance Tracking</h3>
                <p className="mt-4 text-muted-foreground">Report issues instantly and track resolution progress directly from your phone or computer.</p>
              </div>

              <div className="rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                  <Megaphone className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">Community Board</h3>
                <p className="mt-4 text-muted-foreground">Stay informed with digital announcements. Never miss a building meeting or water shutoff notice again.</p>
              </div>

              <div className="rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">Secure & Private</h3>
                <p className="mt-4 text-muted-foreground">Enterprise-grade security ensures that your personal information and documents stay private.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Abstract Element */}
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>
      </main>
    </div>
  );
}
