// import { Phone } from "lucide-react";
// import { FaWhatsapp } from "react-icons/fa";

// function FloatingContactButtons() {
//   return (
//     <div className="fixed bottom-4 right-4 flex flex-col gap-3 z-50 md:hidden">
//       {/* Call Button */}
//       <a
//         href="tel:+919322232809"
//         className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition"
//       >
//         <Phone className="w-6 h-6" />
//       </a>

//       {/* WhatsApp Button */}
//       <a
//         href="https://wa.me/919876543210?text=Hello%20Team%203MT,%20I%20want%20to%20know%20more%20about%20your%20products%20and%20services."
//         target="_blank"
//         rel="noopener noreferrer"
//         className="bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-green-500 transition"
//       >
//         <FaWhatsapp className="w-6 h-6" />
//       </a>
//     </div>
//   );
// }

// export default FloatingContactButtons;


import { Phone, MessageCircle } from "lucide-react";

function FloatingContactButtons() {
  return (
    <>
      {/* Mobile/Tablet (right side, bigger) */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-3 z-50 md:hidden">
        {/* Call Button */}
        <a
          href="tel:+919322232809"
          className="bg-green-600 text-white p-2 rounded-full shadow-lg hover:bg-green-700 transition"
        >
          <Phone className="w-5 h-5" />
        </a>

        {/* WhatsApp Button */}
        <a
          href="https://wa.me/919322232809?text=Hello%20Team%203MT,%20I%20want%20to%20know%20more%20about%20your%20products%20and%20services."
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] text-white p-2 rounded-full shadow-lg hover:bg-green-500 transition"
        >
          <MessageCircle className="w-5 h-5" />
        </a>
      </div>

      {/* Desktop (left side, smaller) */}
      <div className="hidden md:flex fixed bottom-4 right-4 flex-col gap-2 z-50">
        {/* Call Button */}
        <a
          href="tel:+919322232809"
          className="bg-green-600 text-white p-3 rounded-full shadow-md hover:bg-green-700 transition"
        >
          <Phone className="w-5 h-5" />
        </a>

        {/* WhatsApp Button */}
        <a
          href="https://wa.me/919322232809?text=Hello%20Team%203MT,%20I%20want%20to%20know%20more%20about%20your%20products%20and%20services."
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] text-white p-3 rounded-full shadow-md hover:bg-green-500 transition"
        >
          <MessageCircle className="w-5 h-5" />
        </a>
      </div>
    </>
  );
}

export default FloatingContactButtons;


