"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminSignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    const admin = {
      name,
      email,
      password,
    };

    localStorage.setItem(
      "adminAccount",
      JSON.stringify(admin)
    );

    alert("Admin account created successfully!");

    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-md border rounded-2xl p-8 bg-card">
        <h1 className="text-3xl font-bold mb-2">
          Create Admin Account
        </h1>

        <p className="text-muted-foreground mb-6">
          Register as a CulturalVault administrator
        </p>

        <form
          onSubmit={handleSignup}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="w-full border rounded-xl px-4 py-3 bg-background"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border rounded-xl px-4 py-3 bg-background"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full border rounded-xl px-4 py-3 bg-background"
            required
          />

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-xl"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/admin/login"
            className="text-primary font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}