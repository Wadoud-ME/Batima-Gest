"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Card } from "@/components/ui";
import { toast } from "sonner";
import Link from "next/link";
import { Hexagon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password || !fullName) {
      toast.error("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: fullName,
          role: "Resident", // New signups are always Residents
        },
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("Account created successfully! Welcome!");
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-[420px] space-y-6">
        <Card className="p-10 border border-border shadow-md bg-card rounded-none sm:rounded-2xl">
          <div className="flex flex-col items-center justify-center mb-10">
            <Hexagon className="h-12 w-12 text-primary mb-4 stroke-[1.5]" />
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent mb-4">
              Batima-Gest
            </h1>
            <p className="text-center text-muted-foreground font-medium text-base leading-snug tracking-tight mb-2">
              Sign up to manage your building gracefully.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-muted/30 border-border/60 text-base h-12 focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-background rounded-md"
                required
              />
            </div>
            <div>
              <Input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-muted/30 border-border/60 text-base h-12 focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-background rounded-md"
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-muted/30 border-border/60 text-base h-12 focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-background rounded-md"
                required
              />
            </div>

            <p className="text-sm text-muted-foreground text-center my-4 leading-relaxed py-2">
              People who use our service may have uploaded your contact information to Batima-Gest.
            </p>

            <Button
              type="submit"
              disabled={loading}
              className="w-full font-semibold rounded-lg h-12 text-base shadow-sm mt-2"
            >
              {loading ? "Signing up..." : "Sign up"}
            </Button>
          </form>
        </Card>

        <Card className="p-6 text-center text-base border-border shadow-sm bg-card rounded-none sm:rounded-2xl">
          <span className="text-muted-foreground">Have an account? </span>
          <Link href="/login" className="text-primary font-bold hover:underline">
            Log in
          </Link>
        </Card>
      </div>
    </div>
  );
}
