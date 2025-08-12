// This is a TypeScript feature called an 'interface'.
// It's like a contract that defines the 'shape' of the data our component expects.
// It says, "Anyone who uses ServiceCard MUST provide a 'service' object
// that contains a name, a description, and a price."
interface ServiceCardProps {
  service: {
    name: string;
    description: string;
    price: string;
  };
}

// Our component receives the 'props' object. We use destructuring `{ service }`
// to directly access the service data we passed in.
export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="group p-8 border-0 rounded-2xl shadow-lg bg-brand-cream hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full border border-brand-pink-light/30">
      <div className="w-12 h-12 bg-gradient-to-br from-brand-dusty-pink to-brand-taupe-light rounded-full mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        <div className="w-6 h-6 bg-brand-cream rounded-full opacity-80"></div>
      </div>
      <h3 className="font-title text-2xl font-semibold mb-4 text-brand-taupe group-hover:text-brand-taupe-dark transition-colors duration-300 tracking-wide">
        {service.name}
      </h3>
      <p className="font-body text-brand-taupe-light mb-6 flex-grow leading-relaxed">
        {service.description}
      </p>
      <div className="mt-auto">
        <p className="font-title text-xl font-semibold text-brand-taupe mb-4">{service.price}</p>
        <div className="w-full h-0.5 bg-gradient-to-r from-brand-dusty-pink to-brand-taupe opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  );
}