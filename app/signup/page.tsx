"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  
  const [form, setForm] = useState({ name: " ", email: "", password: "", encryption_key: "" }); // Added encryption_key state
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false); // Added isError state
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsError(false); // Reset error state

    // Ensure all required fields are present for signup
    if (!form.name || !form.email || !form.password || !form.encryption_key) {
        setMessage("Please fill in all fields.");
        setIsError(true);
        return;
    }

    const res = await fetch("/api/signup", { // Corrected API endpoint to /api/signup
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Signup successful! Welcome.");
      // Redirect to a protected dashboard page after successful signup
      router.push('/dashboard');
    } else {
      setMessage(`Error: ${data.message}`);
      setIsError(true); // Set error state if response is not ok
    }
  };

  return (
    <div className="p-10 max-w-md mx-auto"> {/* Added max-w-md mx-auto for centering */}
      <h1 className="text-3xl font-bold mb-6">Sign Up</h1> {/* Changed heading */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Assuming 'name' and 'encryption_key' are also part of your signup form based on route.js */}
        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="border p-2 rounded" />
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required className="border p-2 rounded" />
        <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" required className="border p-2 rounded" />
        <input type="password" name="encryption_key" value={form.encryption_key} onChange={handleChange} placeholder="Encryption Key" required className="border p-2 rounded" />
        
        {/* Label changed to "Sign Up Now" */}
        <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700">Sign Up Now</button>
      </form>
      {message && <p className={`mt-4 ${isError ? 'text-red-500' : 'text-green-500'}`}>{message}</p>} {/* Dynamic message color */}
    </div>
  );
}
