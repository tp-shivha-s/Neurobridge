import { useState } from "react";
import { Brain, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRole } from "@/context/RoleContext";

export default function AuthGate() {
  const { signInWithEmail } = useRole();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = signInWithEmail(email);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold">NeuroBridge Access</h1>
            <p className="text-sm text-muted-foreground">Sign in with an authorized email ID</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="auth-email">Email ID</label>
            <Input
              id="auth-email"
              type="email"
              placeholder="name@domain.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>

          {error ? (
            <div className="rounded-md border border-red-300 bg-red-50 text-red-700 text-sm px-3 py-2">
              {error}
            </div>
          ) : null}

          <Button type="submit" className="w-full">
            <Mail className="w-4 h-4 mr-2" />
            Continue
          </Button>
        </form>

        <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 text-amber-800 text-xs px-3 py-2 flex items-start gap-2">
          <Shield className="w-4 h-4 mt-0.5" />
          Access is restricted to pre-authorized admin and user email IDs.
        </div>
      </div>
    </div>
  );
}
