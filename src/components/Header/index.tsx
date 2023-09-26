"use client";

import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { signOut } = useAuth();

  return (
    <div>
      <button onClick={() => signOut()}>logout</button>
    </div>
  );
}
