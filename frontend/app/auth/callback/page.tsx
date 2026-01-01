"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";

export default function CallbackPage() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        window.location.href = "/dashboard";
      }
    });
  }, []);

  return <p className="p-10">Signing you in...</p>;
}
