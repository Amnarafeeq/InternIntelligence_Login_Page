"use client";
import { useState, FormEvent } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../firebase/firebase";
import Link from "next/link";

const RegisterPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Password do not Match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await sendEmailVerification(user);

      localStorage.setItem(
        "registrationData",
        JSON.stringify({
          firstName,
          lastName,
          gender,
          email,
        })
      );
      setMessage(
        "Registration Successful! Please check your email for verification."
      );

      setFirstName("");
      setLastName("");
      setGender("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
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
          Register
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {message && <p className="text-green-500 text-center">{message}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-[#252B42] border border-[#00FFFF] text-white focus:outline-none focus:ring-2 focus:ring-[#00FFFF]"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-[#252B42] border border-[#00FFFF] text-white focus:outline-none focus:ring-2 focus:ring-[#00FFFF]"
          />
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-[#252B42] border border-[#00FFFF] text-white focus:outline-none focus:ring-2 focus:ring-[#00FFFF]"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-[#252B42] border border-[#00FFFF] text-white focus:outline-none focus:ring-2 focus:ring-[#00FFFF]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-[#252B42] border border-[#00FFFF] text-white focus:outline-none focus:ring-2 focus:ring-[#00FFFF]"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-[#252B42] border border-[#00FFFF] text-white focus:outline-none focus:ring-2 focus:ring-[#00FFFF]"
          />
          <button
            type="submit"
            className="w-full py-2 text-center text-[#121212] bg-[#00FFFF] hover:bg-[#00E0E0] rounded-md font-bold transition-all"
          >
            Register
          </button>
        </form>
        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-[#FF007F] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
