"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Card } from "@/components/ui";
import { toast } from "sonner";
import Link from "next/link";
import { Hexagon } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast.error("Please enter email and password.");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      // Mock login logic
      if (email.includes("admin")) {
        document.cookie = "mockRole=Admin; path=/";
        toast.success("Welcome back, Administrator!");
        router.push("/admin");
      } else {
        document.cookie = "mockRole=Resident; path=/";
        toast.success("Welcome back! You have successfully logged in.");
        router.push("/dashboard");
      }
      setLoading(false);
    }, 800);
  };

  const handleDemoLogin = (role: 'Admin' | 'Resident') => {
    setLoading(true);
    setEmail(role === 'Admin' ? "admin@batima.demo" : "resident@batima.demo");
    setPassword("demo123");
    toast.success(`Demo ${role} loaded! Logging in...`);
    
    setTimeout(() => {
      document.cookie = `mockRole=${role}; path=/`;
      router.push(role === 'Admin' ? "/admin" : "/dashboard");
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-[420px] space-y-6">
        <Card className="p-10 border border-border shadow-md bg-card rounded-none sm:rounded-2xl">
          <div className="flex flex-col items-center justify-center mb-10">
            <Hexagon className="h-12 w-12 text-primary mb-4 stroke-[1.5]" />
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
              Batima-Gest
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Input
                type="email"
                placeholder="Phone number, username, or email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-muted/30 border-border/60 text-base h-12 focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-background"
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-muted/30 border-border/60 text-base h-12 focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-background"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full font-semibold rounded-lg h-12 text-base shadow-sm mt-2"
            >
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </form>

          <div className="mt-8 flex items-center justify-center space-x-4">
            <div className="h-px bg-border flex-1" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              OR TRY A DEMO
            </span>
            <div className="h-px bg-border flex-1" />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => handleDemoLogin('Resident')}
              className="w-full font-semibold rounded-lg h-12 shadow-sm border-border/60 hover:bg-muted/50"
            >
              Resident
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => handleDemoLogin('Admin')}
              className="w-full font-semibold rounded-lg h-12 shadow-sm border-border/60 hover:bg-muted/50"
            >
              Admin
            </Button>
          </div>

          <div className="mt-8 text-center">
            <button type="button" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Forgot password?
            </button>
          </div>
        </Card>

        <Card className="p-6 text-center text-base border-border shadow-sm bg-card rounded-none sm:rounded-2xl">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link href="/signup" className="text-primary font-bold hover:underline">
            Sign up
          </Link>
        </Card>
      </div>
    </div>
  );
}
