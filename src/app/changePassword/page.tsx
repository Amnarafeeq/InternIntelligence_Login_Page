"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import { auth } from "../firebase/firebase";

const PasswordChange = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handlePasswordChange = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match");
      return;
    }
    try {
      const user = auth.currentUser;
      if (user && user.email) {
        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword
        );
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        setMessage("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        setError("No user is currently signed in.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#121212] text-[#EDEDED]">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#1A1A1A] rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-[#00FFFF]">
          Change Password
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {message && <p className="text-green-500 text-center">{message}</p>}
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-[#252B42] border border-[#00FFFF] text-white focus:outline-none focus:ring-2 focus:ring-[#00FFFF]"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-[#252B42] border border-[#00FFFF] text-white focus:outline-none focus:ring-2 focus:ring-[#00FFFF]"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-[#252B42] border border-[#00FFFF] text-white focus:outline-none focus:ring-2 focus:ring-[#00FFFF]"
          />
          <button
            type="submit"
            className="w-full py-2 text-center text-[#121212] bg-[#00FFFF] hover:bg-[#00E0E0] rounded-md font-bold transition-all"
          >
            Update Password
          </button>
        </form>
        <p className="text-center text-sm">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-[#FF007F] hover:underline"
          >
            Back to Dashboard
          </button>
        </p>
      </div>
    </div>
  );
};

export default PasswordChange;
