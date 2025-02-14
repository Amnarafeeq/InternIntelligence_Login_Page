"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, firestore } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const DashboardPage = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(`${userData.firstName} ${userData.lastName}`);
        } else {
          router.push("/login");
        }
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout Error", error);
    }
  };

  const handleChangePassword = () => {
    router.push("/changePassword");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <p className="text-[#00FFFF] text-xl font-bold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] bg-gradient-to-b from-[#1A1A1A] to-black text-[#EDEDED] flex flex-col">
      <nav className="bg-[#1A1A1A] p-4 shadow-lg w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="text-[#00FFFF] text-2xl font-bold">Dashboard</div>
          </div>
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center flex-grow px-4 sm:px-6 text-center w-full">
        {userName && (
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-[#FF007F]">
            Welcome, {userName}
          </h1>
        )}

        <div className="flex flex-col items-center gap-4 w-full max-w-xs sm:max-w-sm md:max-w-md">
          <button
            onClick={handleLogout}
            className="w-full px-6 py-3 bg-[#FF007F] text-[#121212] font-bold rounded-md hover:bg-[#E6006D] transition-all"
          >
            Logout
          </button>
          <button
            onClick={handleChangePassword}
            className="w-full px-6 py-3 bg-[#00FFFF] text-[#121212] font-bold rounded-md hover:bg-[#00E0E0] transition-all"
          >
            Change Password
          </button>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
