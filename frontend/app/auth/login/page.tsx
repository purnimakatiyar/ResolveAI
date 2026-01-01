"use client";

import { supabase } from "@/lib/supabaseClient";
import AuthCard from "@/components/AuthCard";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
    else window.location.href = "/dashboard";
  };

  const googleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "http://localhost:3000/auth/callback" },
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
      <AuthCard>
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome Back</h1>

        <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <Input
          className="mt-4"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button className="mt-6" onClick={login}>
          Login
        </Button>

        <Button
          className="mt-3 bg-white text-black border"
          onClick={googleLogin}
        >
          Continue with Google
        </Button>
      </AuthCard>
    </main>
  );
}
