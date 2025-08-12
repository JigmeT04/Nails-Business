"use client";



import Image from "next/image";

import Link from "next/link";

import ServiceCard from './components/ServiceCard';

import { useAuth } from "@/lib/AuthContext";

import Slideshow from "./components/Slideshow";



export default function Home() {

  const { user } = useAuth();



  const services = [

    { name: "Design Tier 1", description: "Simple Nail Art - Frenchies or 1-3 minimal art, Plain multi color/one color, aura/ombre", price: "$85" },

    { name: "Design Tier 2", description: "Intermediate Nail Art - Simple 3d lines/drawings/chrome", price: "$95" },

    { name: "Design Tier 3", description: "Advanced Nail Art - Mix & match design, Chrome/isolated, chrome/airbrush 3d designs", price: "$105" },

    { name: "Design Tier 4", description: "Intricate Nail Art - This is the highest level of nail art offered. Multiple nail art on ALL fingers.", price: "$115" }

  ];



  // Add a 'name' property to each image for the caption

  const galleryImages = [

    { src: '/1.jpg', alt: 'Elegant white and gold nail art', name: 'Classic Gold' },

    { src: '/2.jpg', alt: 'Trendy pink chrome nails', name: 'Pink Chrome' },

    { src: '/3.jpg', alt: 'Intricate blue nail designs', name: 'Blue Swirl' },

    { src: '/4.jpg', alt: 'A classic, glossy red manicure', name: 'Classic Red' },

    { src: '/5.jpg', alt: 'Elegant white and gold nail art', name: 'Glitter Tips' },

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

            Where elegance meets perfection

          </p>

          <Link

            href={user ? "/booking" : "/login"}

            className="inline-block bg-brand-taupe hover:bg-brand-taupe-dark text-brand-cream font-semibold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-brand-taupe-light/30"

          >

            Book Your Appointment

          </Link>

        </div>

      </section>



      {/* Services Section */}

      <section id="services" className="py-20 px-4 text-center bg-brand-warm-beige">

        <div className="max-w-6xl mx-auto">

          <h2 className="font-title text-4xl md:text-5xl font-semibold mb-4 text-brand-taupe tracking-wider">Design Tiers</h2>

          <p className="font-body text-lg text-brand-taupe-light mb-12 max-w-2xl mx-auto font-light">

            Choose from our curated service tiers, each designed to deliver exceptional results at every level

          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            {services.map((service, index) => (

              <ServiceCard key={index} service={service} />

            ))}

          </div>

        </div>

      </section>

      {/* GELX Extensions Section */}
      <section id="gelx" className="py-20 px-4 text-center bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-title text-4xl md:text-5xl font-semibold mb-4 text-brand-taupe tracking-wider">
            APRES GEL EXTENSIONS ✶
          </h2>
          <p className="font-body text-lg text-brand-taupe-light mb-12 max-w-2xl mx-auto font-light">
            Full set of soft gel tips ✶ 6/s ✶ *Includes nail prep & e-file manicure
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ServiceCard service={{ name: "GELX Tier 1", description: "Full set of soft gel tips ✶ 6/s ✶ *Includes nail prep & e-file manicure", price: "$85" }} />
            <ServiceCard service={{ name: "GELX Tier 2", description: "Full set of soft gel tips ✶ 6/s ✶ *Includes nail prep & e-file manicure", price: "$95" }} />
            <ServiceCard service={{ name: "GELX Tier 3", description: "Full set of soft gel tips ✶ 6/s ✶ *Includes nail prep & e-file manicure", price: "$105" }} />
            <ServiceCard service={{ name: "GELX Tier 4", description: "Full set of soft gel tips ✶ 6/s ✶ *Includes nail prep & e-file manicure", price: "$115" }} />
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-20 px-4 text-center bg-brand-warm-beige">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-title text-4xl md:text-5xl font-semibold mb-4 text-brand-taupe tracking-wider">
            ADD ONS
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="font-title text-2xl font-semibold text-brand-taupe mb-4">Soak Off</h3>
              <p className="font-body text-brand-taupe-light mb-4">
                My sets only / No foreign removals of any kind. New clients please come with bare nails ♡
              </p>
              <p className="font-title text-2xl font-semibold text-brand-rose">$20</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="font-title text-2xl font-semibold text-brand-taupe mb-4">Freestyles</h3>
              <p className="font-body text-brand-taupe-light mb-4">
                Combination of various designs given by client or complete control can be given to nail artist ♡
              </p>
              <p className="font-body text-brand-taupe-light">
                Freestyles typically range from tier 3 - tier 4
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* Gallery Section with new Slideshow */}

      <section id="gallery" className="py-20 px-4 bg-gradient-to-b from-brand-pink-soft to-brand-cream text-center">

        <div className="max-w-6xl mx-auto">

          <h2 className="font-title text-4xl md:text-5xl font-semibold mb-4 text-brand-taupe tracking-wider">Portfolio</h2>

          <p className="font-body text-lg text-brand-taupe-light mb-12 max-w-2xl mx-auto font-light">

            Explore our artistry through stunning nail designs and transformations

          </p>

          <Slideshow images={galleryImages} />

        </div>

      </section>

    </main>

  );

}