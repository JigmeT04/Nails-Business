'use client';

// This is a simple "static" page, so it doesn't need complex logic like useState or useEffect.
export default function PoliciesPage() {
  // We'll store your policy sections in an array of objects for easy mapping.
  // This is a clean way to manage content.
  const policySections = [
    {
      title: "Booking Policies",
      policies: [
        {
          name: "Appointments",
          description: "Monthly bookings open the last Sunday of each month. You are REQUESTING an appointment and should look for a confirmation email."
        },
        {
          name: "Deposit & Payment",
          description: "A NON-REFUNDABLE $30 deposit must be sent via Zelle to secure your booking. The remaining balance is due in CASH at your appointment."
        },
        {
          name: "Late Arrivals",
          description: "There is a 15-minute grace period. After 15 minutes, your appointment may be cancelled or a simpler design may be required."
        },
        {
          name: "Cancellations & No-Shows",
          description: "A 48-hour notice is required for your deposit to be transferable. No-shows or late cancellations will forfeit the deposit and may prevent future bookings."
        }
      ]
    },
    {
      title: "Before Your Appointment",
      policies: [
        {
          name: "Bare & Healthy Nails",
          description: "Please arrive with bare, healthy nails. I do not work over the work of other nail technicians. Gel extensions are applied during the service."
        },
        {
          name: "No Extra Guests",
          description: "Please do not bring any extra guests with you to your appointment. There will be NO EXTRA GUEST allowed."
        },
        {
          name: "Location & Arrival",
          description: "The address is suite-based and will be sent after your booking is confirmed. Please send a message upon arrival."
        },
        {
          name: "Design Quotes",
          description: "For an exact quote on a specific design, please send a direct message to YVDNAILS on Instagram."
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto my-12 p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">
        Our Policies
      </h1>
      <p className="text-center text-gray-500 mb-10">
        Please read the following information carefully before booking.
      </p>

      {/* Map over the sections to display them dynamically */}
      {policySections.map(section => (
        <div key={section.title} className="mb-12">
          <h2 className="text-2xl font-semibold border-b-2 border-pink-300 pb-2 mb-6">
            {section.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Map over the policies within each section */}
            {section.policies.map(policy => (
              <div key={policy.name} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold text-lg mb-1 text-gray-700">{policy.name}</h3>
                <p className="text-gray-600">{policy.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <div className="text-center mt-8 text-sm text-gray-500">
          <p>By proceeding to book with YVDNAILS, you acknowledge that you have read and agree to all policies.</p>
          <p>This agreement remains effective for this and all future services.</p>
      </div>
    </div>
  );
}
