"use client";

import { useRouter } from "next/navigation";

export default function BackLink() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="text-xs font-medium cursor-pointer"
      style={{ color: "var(--accent-blue-light)", background: "none", border: "none", padding: 0 }}
    >
      &larr; Back
    </button>
  );
}
