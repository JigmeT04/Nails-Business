"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from '@/lib/AuthContext';
import ServiceCard from './components/ServiceCard';
import Slideshow from './components/Slideshow';
import ReviewForm from './components/ReviewForm';

export default function Home() {
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Define your services data
  const services = [
    {
      name: "Design Tier 1",
      description: "Classic nail artistry with elegant simplicity - Basic nail art, single color design, cuticle care, base & top coat",
      price: "$70"
    },
    {
      name: "Design Tier 2", 
      description: "Enhanced designs with artistic flair - Two-tone designs, simple patterns, French tips, nail strengthening",
      price: "$80"
    },
    {
      name: "Design Tier 3",
      description: "Premium artistry with intricate details - Complex patterns, hand-painted art, texture work, premium products",
      price: "$90"
    },
    {
      name: "Design Tier 4",
      description: "Master-level artistry for special occasions - 3D nail art, crystal embellishments, custom designs, luxury treatment",
      price: "$100"
    }
  ];

  const gelxServices = [
    {
      name: "GELX Tier 1",
      description: "Professional GELX extensions with basic styling - GELX application, length customization, basic shaping, single color finish",
      price: "$85"
    },
    {
      name: "GELX Tier 2",
      description: "Enhanced GELX with artistic elements - Premium GELX tips, two-tone designs, simple nail art, strengthening treatment", 
      price: "$95"
    },
    {
      name: "GELX Tier 3",
      description: "Advanced GELX artistry with premium finishes - Complex designs, texture application, hand-painted details, luxury care",
      price: "$105"
    },
    {
      name: "GELX Tier 4", 
      description: "Master-level GELX for ultimate luxury - 3D embellishments, custom artwork, premium materials, VIP experience",
      price: "$115"
    }
  ];

  const galleryImages = [
    { src: '/1.jpg', alt: 'Elegant nude nail design with gold accents', name: 'Golden Touch' },
    { src: '/2.jpg', alt: 'Vibrant pink gradient nails', name: 'Sunset Blush' },
    { src: '/3.jpg', alt: 'Sophisticated black and white nail art', name: 'Monochrome Magic' },
    { src: '/4.jpg', alt: 'Delicate floral nail designs', name: 'Spring Blooms' },
    { src: '/5.jpg', alt: 'Shimmery silver chrome nails', name: 'Silver Dreams' },
    { src: '/6.jpg', alt: 'Trendy pink chrome nails', name: 'Rose Gold' },
    { src: '/7.jpg', alt: 'Intricate blue nail designs', name: 'Ocean Waves' },
    { src: '/8.jpg', alt: 'A classic, glossy red manicure', name: 'Cherry Blossom' }
  ];

  return (
    <main className="bg-brand-cream text-brand-taupe">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-pink-soft/20 to-brand-dusty-pink/30 z-10"></div>
        <Image
          src="/hero-image.jpg"
          alt="Beautifully manicured nails"
          layout="fill"
          objectFit="cover"
          className="brightness-90"
        />
        <div className="relative z-20 p-6 max-w-4xl mx-auto">
          <h1 className="font-title text-6xl md:text-8xl font-semibold mb-6 text-brand-taupe drop-shadow-sm tracking-widest">
            YVD NAILS
          </h1>
          <p className="font-body text-xl md:text-2xl mb-4 text-brand-taupe-dark/90 drop-shadow-sm font-light tracking-wide">
            Premium Eyelashes & Nail Artistry
          </p>
          <p className="script-text text-lg md:text-xl mb-8 text-brand-sage/80 italic">
            Where beauty meets precision
          </p>
          <Link href="/booking" className="inline-block bg-brand-taupe hover:bg-brand-taupe-dark text-brand-cream px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
            Book Now
          </Link>
        </div>
      </section>

      {/* Design Tiers Section */}
      <section id="services" className="py-20 px-4 bg-gradient-to-b from-brand-cream to-brand-light-gray text-center">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-title text-4xl md:text-5xl font-semibold mb-4 text-brand-taupe tracking-wider">Design Tiers</h2>
          <p className="font-body text-lg text-brand-taupe-light mb-12 max-w-2xl mx-auto font-light">
            Choose from our carefully crafted tiers of nail artistry, each designed to deliver exceptional beauty and precision
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* GELX Extensions Section */}
      <section id="gelx" className="py-20 px-4 bg-gradient-to-b from-brand-light-gray to-brand-pink-soft text-center">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-title text-4xl md:text-5xl font-semibold mb-4 text-brand-taupe tracking-wider">GELX Extensions</h2>
          <p className="font-body text-lg text-brand-taupe-light mb-12 max-w-2xl mx-auto font-light">
            Professional GELX gel extensions for length, strength, and stunning artistry that lasts
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {gelxServices.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section with Slideshow */}
      <section id="gallery" className="py-20 px-4 bg-gradient-to-b from-brand-pink-soft to-brand-cream text-center">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-title text-4xl md:text-5xl font-semibold mb-4 text-brand-taupe tracking-wider">Portfolio</h2>
          <p className="font-body text-lg text-brand-taupe-light mb-12 max-w-2xl mx-auto font-light">
            Explore our artistry through stunning nail designs and transformations
          </p>
          <Slideshow images={galleryImages} />
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section id="reviews" className="py-20 px-4 bg-gradient-to-br from-brand-light-gray to-brand-nude">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-title text-4xl md:text-5xl font-semibold mb-4 text-brand-taupe tracking-wider">
            What Our Clients Say
          </h2>
          <p className="font-body text-lg text-brand-taupe-light mb-12 max-w-2xl mx-auto font-light">
            Discover why our clients love their nail artistry experience with us
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-brand-pink/20 transform hover:scale-105 transition-transform duration-300">
              <div className="flex justify-center mb-4">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>
              <p className="text-brand-taupe italic mb-4">
                "Absolutely stunning work! The attention to detail is incredible and the nail art exceeded my expectations. The atmosphere is so relaxing too."
              </p>
              <p className="font-semibold text-brand-taupe">Sarah M.</p>
              <p className="text-sm text-brand-taupe-light">Design Tier 3</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-brand-pink/20 transform hover:scale-105 transition-transform duration-300">
              <div className="flex justify-center mb-4">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>
              <p className="text-brand-taupe italic mb-4">
                "The GELX extensions are amazing! They last so long and look incredibly natural. The team is professional and friendly."
              </p>
              <p className="font-semibold text-brand-taupe">Maria L.</p>
              <p className="text-sm text-brand-taupe-light">GELX Tier 2</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-brand-pink/20 transform hover:scale-105 transition-transform duration-300">
              <div className="flex justify-center mb-4">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>
              <p className="text-brand-taupe italic mb-4">
                "I've been coming here for months and the quality is consistently excellent. The loyalty program is a nice bonus too!"
              </p>
              <p className="font-semibold text-brand-taupe">Jennifer K.</p>
              <p className="text-sm text-brand-taupe-light">Loyal Customer</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-2xl border border-brand-pink/20 mb-8">
            <h3 className="font-title text-2xl font-semibold text-brand-taupe mb-6">Share Your Experience</h3>
            <p className="text-brand-taupe-light mb-6">
              Help others discover our exceptional service by sharing your review
            </p>
            
            {!showReviewForm ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/booking" className="inline-block">
                  <button className="bg-brand-taupe hover:bg-brand-taupe-dark text-brand-cream px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Book Your Appointment
                  </button>
                </Link>
                {user && (
                  <button 
                    onClick={() => setShowReviewForm(true)}
                    className="border-2 border-brand-taupe text-brand-taupe hover:bg-brand-taupe hover:text-brand-cream px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Write a Review
                  </button>
                )}
                {!user && (
                  <Link href="/login" className="inline-block">
                    <button className="border-2 border-brand-taupe text-brand-taupe hover:bg-brand-taupe hover:text-brand-cream px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105">
                      Login to Review
                    </button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="mt-8">
                <ReviewForm 
                  onSubmitSuccess={() => {
                    setShowReviewForm(false);
                    // Optionally refresh the page to show new review
                    window.location.reload();
                  }}
                  onCancel={() => setShowReviewForm(false)}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
