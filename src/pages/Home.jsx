// function Home() {
//   return (
//     <section className="p-10 text-center">
//       {/* Hero Section */}
//       <div className="bg-gray-200 rounded-lg shadow-lg p-10 mb-10">
//         <h1 className="text-4xl font-bold text-gray-800">
//           Powering Construction with Reliable Tools & Services
//         </h1>
//         <p className="mt-4 text-lg text-gray-600">
//           Quality tools, trusted service, fast delivery, customer support.
//         </p>
//       </div>

//       {/* Quick Links */}
//       <div className="grid md:grid-cols-2 gap-6">
//         <div className="p-6 bg-yellow-100 rounded-lg shadow hover:scale-105 transition">
//           <h2 className="text-xl font-semibold">Our Products</h2>
//           <p>Explore drills, grinders, cutters, breakers, and more.</p>
//         </div>
//         <div className="p-6 bg-blue-100 rounded-lg shadow hover:scale-105 transition">
//           <h2 className="text-xl font-semibold">Our Services</h2>
//           <p>Repair, maintenance, spare parts, and emergency support.</p>
//         </div>
//       </div>

//       {/* Testimonials */}
//       <div className="mt-12 bg-gray-100 p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      //   <h2 className="text-3xl font-bold mb-6">What Our Clients Say</h2>
        
      //   <div className="flex flex-col items-center">
      //     {/* Avatar */}
      //     <img
      //       src="https://i.pravatar.cc/100?img=12"
      //       alt="Client Avatar"
      //       className="w-20 h-20 rounded-full border-4 border-white shadow-md mb-4"
      //     />

      //     {/* Review Text */}
      //     <p className="italic text-lg text-gray-700">
      //       “3MT tools helped us complete projects faster and safer! Their guidance 
      //       on choosing the right machines made a big difference.”
      //     </p>

      //     {/* Client Info */}
      //     <p className="mt-3 text-gray-900 font-semibold">SHAILESH PATEL</p>
      //     <p className="text-gray-500 text-sm">RAMJIYANI CONSTRUCTION PRIVATE LIMITED, Mumbai</p>

      //     {/* Star Ratings */}
      //     <div className="flex mt-3">
      //       <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
      //       <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
      //       <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
      //       <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
      //       <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
      //     </div>
      //   </div>
      // </div>
//     </section>
//   );
// }
// export default Home;

import {  Wrench } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import { useTranslation } from "react-i18next";

function Home() {
  const { t } = useTranslation();

  return (
    <section className="p-4 sm:p-10 text-center">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-yellow-100 via-white to-blue-100 rounded-2xl shadow-xl p-6 md:p-12 mb-12">
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900">
          {t('home.hero_title')}
        </h1>
        <p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
          {t('home.hero_subtitle')}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
          {/* <a
            href="/products"
            className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-lg hover:bg-yellow-600 transition"
          >
            Explore Products
          </a> */}
          <Link to="/products" className="w-full sm:w-auto px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-lg hover:bg-yellow-600 transition text-center">
            {t('home.explore_products')}
          </Link>
          <Link to="/contact" className="w-full sm:w-auto px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-900 transition text-center">
            {t('home.get_guidance')}
          </Link>
        </div>
      </div>

      {/* Products Carousel */}
<div className="mt-12">
  <h2 className="text-3xl font-bold mb-6">{t('home.our_products')}</h2>
  <Swiper
    modules={[Autoplay, Pagination]}
    autoplay={{ delay: 2500, disableOnInteraction: false }}
    pagination={{ clickable: true }}
    spaceBetween={20}
    slidesPerView={1}
    breakpoints={{
      640: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    }}
    className="pb-10"
  >
    {/* Drill */}
    <SwiperSlide>
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-md">
          <img
            src="https://3mt.netlify.app/images/drill/d3.jpg"
            alt="Drill Machine"
            className="max-h-48 object-contain"
          />
        </div>
        <h3 className="mt-4 text-xl font-semibold">{t('home.drill')}</h3>
        <p className="text-gray-600">
          {t('home.drill_desc')}
        </p>
      </div>
    </SwiperSlide>

    {/* Grinder */}
    <SwiperSlide>
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-md">
          <img
            src="https://3mt.netlify.app/images/grinder/g4.jpg"
            alt="Grinder"
            className="max-h-48 object-contain"
          />
        </div>
        <h3 className="mt-4 text-xl font-semibold">{t('home.grinder')}</h3>
        <p className="text-gray-600">
          {t('home.grinder_desc')}
        </p>
      </div>
    </SwiperSlide>

    {/* Cutter */}
    <SwiperSlide>
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-md">
          <img
            src="https://3mt.netlify.app/images/cutter/c1.jpg"
            alt="Cutter"
            className="max-h-48 object-contain"
          />
        </div>
        <h3 className="mt-4 text-xl font-semibold">{t('home.cutter')}</h3>
        <p className="text-gray-600">
          {t('home.cutter_desc')}
        </p>
      </div>
    </SwiperSlide>

    {/* Breaker */}
    <SwiperSlide>
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-md">
          <img
            src="https://lh3.googleusercontent.com/p/AF1QipNdmhwdXmTASz-jBEeO1YuueXIskP9F5oojl2Q2=w141-h101-n-k-no-nu"
            alt="Breaker"
            className="max-h-48 object-contain"
          />
        </div>
        <h3 className="mt-4 text-xl font-semibold">{t('home.breaker')}</h3>
        <p className="text-gray-600">
          {t('home.breaker_desc')}
        </p>
      </div>
    </SwiperSlide>
  </Swiper>
</div>

      {/* Services Section */}
<div className="mt-16">
  <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('home.our_services')}</h2>
  
  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
    {/* Service 1 */}
    <div className="p-6 bg-blue-50 rounded-lg shadow hover:shadow-lg hover:scale-105 transition flex flex-col items-center">
      <Wrench className="w-12 h-12 text-blue-600 mb-3" />
      <h3 className="text-lg font-semibold">{t('home.repair')}</h3>
      <p className="mt-2 text-gray-700 text-sm text-center">
        {t('home.repair_desc')}
      </p>
    </div>

    {/* Service 2 */}
    <div className="p-6 bg-blue-50 rounded-lg shadow hover:shadow-lg hover:scale-105 transition flex flex-col items-center">
      <img src="https://img.icons8.com/ios-filled/50/000000/maintenance.png" 
           alt="Maintenance" className="w-12 h-12 mb-3" />
      <h3 className="text-lg font-semibold">{t('home.maintenance')}</h3>
      <p className="mt-2 text-gray-700 text-sm text-center">
        {t('home.maintenance_desc')}
      </p>
    </div>

    {/* Service 3 */}
    <div className="p-6 bg-blue-50 rounded-lg shadow hover:shadow-lg hover:scale-105 transition flex flex-col items-center">
      <img src="https://img.icons8.com/ios-filled/50/000000/gear.png" 
           alt="Spare Parts" className="w-12 h-12 mb-3" />
      <h3 className="text-lg font-semibold">{t('home.spare_parts')}</h3>
      <p className="mt-2 text-gray-700 text-sm text-center">
        {t('home.spare_parts_desc')}
      </p>
    </div>

    {/* Service 4 */}
    <div className="p-6 bg-blue-50 rounded-lg shadow hover:shadow-lg hover:scale-105 transition flex flex-col items-center">
      <img src="https://img.icons8.com/ios-filled/50/000000/24-hours.png" 
           alt="Emergency Support" className="w-12 h-12 mb-3" />
      <h3 className="text-lg font-semibold">{t('home.emergency')}</h3>
      <p className="mt-2 text-gray-700 text-sm text-center">
        {t('home.emergency_desc')}
      </p>
    </div>
  </div>

  {/* CTA */}
  <div className="text-center mt-10">
    <Link to="/contact" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">
      {t('home.contact_service')}
    </Link>
  </div>
</div>

      {/* Testimonials */}
      
    </section>
  );
}
export default Home;
