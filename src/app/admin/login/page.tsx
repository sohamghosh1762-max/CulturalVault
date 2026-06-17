"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const storedAdmin =
      localStorage.getItem("adminAccount");

    if (!storedAdmin) {
      alert(
        "No admin account found. Please create an admin account first."
      );
      return;
    }

    const admin = JSON.parse(storedAdmin);

    if (
      email === admin.email &&
      password === admin.password
    ) {
      localStorage.setItem(
        "adminLoggedIn",
        "true"
      );

      router.push("/admin/dashboard");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-md border rounded-2xl p-8 bg-card">
        <h1 className="text-3xl font-bold mb-2">
          Admin Login
        </h1>

        <p className="text-muted-foreground mb-6">
          Access the CulturalVault dashboard
        </p>

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >
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
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          New Admin?{" "}
          <Link
            href="/admin/signup"
            className="text-primary font-semibold"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}