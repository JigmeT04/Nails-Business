"use client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import SignaturePad from "react-signature-canvas";

export default function TermsPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [sigDataUrl, setSigDataUrl] = useState<string | null>(null);
    const sigPadRef = useRef<SignaturePad>(null);

    const isFormValid = name.trim() !== "" && sigDataUrl !== null;

    const handleClear = () => {
        sigPadRef.current?.clear();
        setSigDataUrl(null);
    };

    const handleSaveSignature = () => {
        if (sigPadRef.current && !sigPadRef.current.isEmpty()) {
            const dataUrl = sigPadRef.current.getTrimmedCanvas().toDataURL("image/png");
            setSigDataUrl(dataUrl);
            alert("✅ Signature captured!");
        } else {
            alert("⚠️ Please sign before saving.");
        }
    };

    const handleSubmit = () => {
        alert(`✅ Agreement submitted by ${name}`);
        router.push("/");
    };

    return (
        <main className="p-8 max-w-2xl mx-auto">
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
                    After 15 minutes appointment may be cancelled or a simpler.
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
                >
                    Clear
                </button>
                <button
                    onClick={handleSaveSignature}
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                >
                    Save Signature
                </button>
            </div>

            <button
                onClick={handleSubmit}
                disabled={!isFormValid}
                className={`py-3 px-6 rounded font-semibold transition duration-300 ${isFormValid
                    ? "bg-pink-600 hover:bg-pink-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
            >
                ✅ Submit Agreement
            </button>
        </main>
    );
}
