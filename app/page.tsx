"use client";

import Image from "next/image";
import Link from "next/link";
import ServiceCard from './components/ServiceCard';
// 1. Import the useAuth hook
import { useAuth } from "@/lib/AuthContext";

export default function Home() {
  // 2. Use the hook to get the current user
  const { user } = useAuth();

  // Data for our services section
  const services = [
    {
      name: "Classic Manicure",
      description: "A timeless classic. Includes shaping, cuticle care, and a polish of your choice.",
      price: "$30"
    },
    {
      name: "Gel-X Extensions",
      description: "Durable and beautiful extensions for the perfect length and shape.",
      price: "$80"
    },
    {
      name: "Spa Pedicure",
      description: "Relax and rejuvenate with our luxurious spa pedicure, including a scrub and massage.",
      price: "$55"
    },
    {
      name: "Eyelash Extensions",
      description: "Classic, hybrid, and volume sets for a stunning look.",
      price: "Starting at $120"
    }
  ];

  // Data for our gallery section
  const galleryImages = [
    { src: '/nail-art-1.jpg', alt: 'Elegant white and gold nail art' },
    { src: '/pink-chrome-nails.jpg', alt: 'Trendy pink chrome nails' },
    { src: '/blue-designs.jpg', alt: 'Intricate blue nail designs' },
    { src: '/classic-red.jpg', alt: 'A classic, glossy red manicure' },
  ];

  return (
    <main className="bg-white text-gray-800">
      {/* 1. Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center text-white">
        <Image
          src="/hero-image.jpg"
          alt="Beautifully manicured nails"
          layout="fill"
          objectFit="cover"
          className="brightness-50"
        />
        <div className="relative z-10 p-4">
          <h1 className="text-5xl font-bold mb-4">YVD NAILS</h1>
          <p className="text-xl mb-8">Premium Eyelashes & Nail Artistry</p>
          {/* 3. This Link is now "smart" */}
          <Link
            // If user exists, go to /booking. If not, go to /login.
            href={user ? "/booking" : "/login"}
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors"
          >
            Book Now
          </Link>
        </div>
      </section>

      {/* 2. Services Section */}
      <section id="services" className="py-20 px-4 text-center">
        <h2 className="text-3xl font-bold mb-10">Our Services</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>
      </section>

      {/* 3. Gallery Section */}
      <section id="gallery" className="py-20 px-4 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-10">Our Work</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
              <Image
                src={image.src}
                alt={image.alt}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-110"
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
