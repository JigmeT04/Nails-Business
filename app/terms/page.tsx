"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import SignaturePad from "react-signature-canvas";
import { toast, Toaster } from 'sonner';

// Firebase imports
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';

// Context and utilities
import { useAuth } from '@/lib/AuthContext';

export default function TermsPage() {
    const router = useRouter();
    const { user, userData, refreshUserData } = useAuth();
    const db = getFirestore(app);

    const [name, setName] = useState("");
    const [sigDataUrl, setSigDataUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const sigPadRef = useRef<SignaturePad>(null);

    // Initialize name from user data when available
    useEffect(() => {
        if (userData?.displayName && !name) {
            setName(userData.displayName);
        }
    }, [userData, name]);

    const isFormValid = name.trim() !== "" && sigDataUrl !== null;

    const handleClear = () => {
        if (sigPadRef.current) {
            sigPadRef.current.clear();
            setSigDataUrl(null);
        }
    };

    const handleSaveSignature = () => {
        if (sigPadRef.current && !sigPadRef.current.isEmpty()) {
            try {
                // Use getSignaturePad method to get the canvas directly
                const dataUrl = sigPadRef.current.toDataURL("image/png");
                setSigDataUrl(dataUrl);
                toast.success("✅ Signature captured!");
            } catch (error) {
                console.error('Error saving signature:', error);
                toast.error("❌ Error capturing signature");
            }
        } else {
            toast.error("⚠️ Please sign before saving.");
        }
    };

    const handleSubmit = async () => {
        if (!user || !isFormValid) return;
        
        setIsSubmitting(true);
        try {
            await updateDoc(doc(db, 'users', user.uid), {
                hasSignedTerms: true,
                termsSignedAt: new Date(),
                digitalSignature: name.trim(),
                signatureImageUrl: sigDataUrl,
            });

            await refreshUserData();
            toast.success(`✅ Agreement submitted by ${name}`);
            
            // Redirect based on where they came from or to profile
            setTimeout(() => {
                router.push("/profile");
            }, 2000);
        } catch (error) {
            console.error('Error submitting agreement:', error);
            toast.error("❌ Error submitting agreement. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="p-8 max-w-2xl mx-auto">
            <Toaster />
            
            {/* Show user status if logged in */}
            {user && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800">
                        <strong>Logged in as:</strong> {userData?.displayName || user.email}
                    </p>
                    {userData?.hasSignedTerms ? (
                        <p className="text-green-700 mt-2">
                            ✅ You have already signed the terms. Signing again will update your signature.
                        </p>
                    ) : (
                        <p className="text-orange-700 mt-2">
                            ⏳ You need to sign these terms to book appointments.
                        </p>
                    )}
                </div>
            )}
            
            <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
            <p className="mb-4">
                By requesting to book with YVDNAILS you are agreeing to the following terms and conditions.
            </p>
            <p className="mb-4">I agree to the following:</p>
            <ul className="list-none space-y-2 mb-4">
                <li className="before:content-['💖'] before:mr-2">
                    Gel extensions are applied during the service.
                </li>
                <li className="before:content-['💖'] before:mr-2">
                    There will NO EXTRA GUESTS allowed.
                </li>
                <li className="before:content-['💖'] before:mr-2">
                    After 15 minutes appointment may be cancelled or a simpler service will be provided.
                </li>
                <li className="before:content-['💖'] before:mr-2">
                    If I no show, I will lose the deposit and will lose booking with YVDNAILS.
                </li>
                <li className="before:content-['💖'] before:mr-2">
                    I am REQUESTING an appointment with YVDNAILS and be on the lookout for a confirmation email
                </li>
                <li className="before:content-['💖'] before:mr-2">
                    I will have to send a NON-REFUNDABLE $30 through zelle. This deposit will be deducted from remaining balance.
                </li>
                <li className="before:content-['💖'] before:mr-2">
                    This agreement will remain effective for this service and future services conducted by YVDNAILS.
                </li>
            </ul>

            <p className="mb-2 font-semibold">Please type your full name:</p>
            <input
                type="text"
                placeholder="Type your full name here"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full mb-4"
            />
            
            <p className="mb-2 font-semibold">Sign below:</p>
            <SignaturePad
                ref={sigPadRef}
                canvasProps={{
                    className: "border border-gray-300 rounded w-full h-48 mb-4",
                }}
            />

            <div className="flex gap-4 mb-6">
                <button
                    onClick={handleClear}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
                    disabled={isSubmitting}
                >
                    Clear
                </button>
                <button
                    onClick={handleSaveSignature}
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                    disabled={isSubmitting}
                >
                    Save Signature
                </button>
            </div>

            <button
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                className={`py-3 px-6 rounded font-semibold transition duration-300 ${isFormValid && !isSubmitting
                    ? "bg-pink-600 hover:bg-pink-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
            >
                {isSubmitting ? "⏳ Submitting..." : "✅ Submit Agreement"}
            </button>
            
            {!user && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800">
                        <strong>Note:</strong> You need to be logged in to save your signature to your profile. 
                        <a href="/login" className="text-blue-600 hover:underline ml-1">Log in here</a>.
                    </p>
                </div>
            )}
        </main>
    );
}
