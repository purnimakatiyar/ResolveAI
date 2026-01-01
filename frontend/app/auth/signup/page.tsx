"use client";

import { supabase } from "@/lib/supabaseClient";
import AuthCard from "@/components/AuthCard";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signup = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) alert(error.message);
    else alert("Signup successful! You can now login.");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
      <AuthCard>
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>

        <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <Input
          className="mt-4"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button className="mt-6" onClick={signup} disabled={loading}>
          {loading ? "Creating..." : "Sign Up"}
        </Button>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <a href="/auth/login" className="text-purple-600 font-medium">
            Login
          </a>
        </p>
      </AuthCard>
    </main>
  );
}
