"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "./firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { User } from "firebase/auth";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.emailVerified) {
          const userDoc = await getDoc(doc(firestore, "users", user.uid));
          if (!userDoc.exists()) {
            const registrationData = localStorage.getItem("registrationData");
            const {
              firstName = "",
              lastName = "",
              gender = "",
            } = registrationData ? JSON.parse(registrationData) : {};
            await setDoc(doc(firestore, "users", user.uid), {
              firstName,
              lastName,
              gender,
              email: user.email,
            });

            localStorage.removeItem("registrationData");
          }
          setUser(user);
          router.push("/dashboard");
        } else {
          setUser(null);
          router.push("/login");
        }
      } else {
        setUser(null);
        router.push("/login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212]">
    <p className="text-[#00FFFF] text-xl sm:text-2xl font-bold text-center animate-pulse">
      {user ? "Redirecting to dashboard..." : "Redirecting to Login..."}
    </p>
  </div>
  
  
  );
}
