import { CheckCircle, Users, Target, Award, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();
  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-yellow-500 mb-4">
          {t('about.title')}
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          {t('about.subtitle')}
        </p>
      </div>

      {/* Who We Are */}
      <section className="grid md:grid-cols-2 gap-10 mb-16">
        <div>
          <h2 className="text-2xl font-semibold mb-4">{t('about.who_we_are')}</h2>
          <p className="text-gray-700 leading-relaxed">
            {t('about.who_we_are_desc')}
          </p>
        </div>
        <div>
          <img
            src="https://3mt.netlify.app/images/gallery/g1.jpg"
            alt="3MT Machine Tools"
            loading="lazy"
            decoding="async"
            className="rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="grid md:grid-cols-2 gap-10 mb-16">
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">{t('about.mission')}</h2>
          <p className="text-gray-700">
            {t('about.mission_desc')}
          </p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">{t('about.vision')}</h2>
          <p className="text-gray-700">
            {t('about.vision_desc')}
          </p>
        </div>
      </section>

      {/* Our Values */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">{t('about.values')}</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="p-6 bg-yellow-50 rounded-lg shadow text-center">
            <Users className="w-10 h-10 text-yellow-600 mx-auto mb-3" />
            <h3 className="font-semibold">{t('about.value1')}</h3>
            <p className="text-gray-600 text-sm">
              {t('about.value1_desc')}
            </p>
          </div>
          <div className="p-6 bg-yellow-50 rounded-lg shadow text-center">
            <Award className="w-10 h-10 text-yellow-600 mx-auto mb-3" />
            <h3 className="font-semibold">{t('about.value2')}</h3>
            <p className="text-gray-600 text-sm">
              {t('about.value2_desc')}
            </p>
          </div>
          <div className="p-6 bg-yellow-50 rounded-lg shadow text-center">
            <Target className="w-10 h-10 text-yellow-600 mx-auto mb-3" />
            <h3 className="font-semibold">{t('about.value3')}</h3>
            <p className="text-gray-600 text-sm">
              {t('about.value3_desc')}
            </p>
          </div>
          <div className="p-6 bg-yellow-50 rounded-lg shadow text-center">
            <CheckCircle className="w-10 h-10 text-yellow-600 mx-auto mb-3" />
            <h3 className="font-semibold">{t('about.value4')}</h3>
            <p className="text-gray-600 text-sm">
              {t('about.value4_desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Our Journey - Timeline */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">{t('about.journey')}</h2>
        <div className="relative border-l-4 border-yellow-400 ml-6">
          {/* Timeline Item 1 */}
          <div className="mb-10 ml-6">
            <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-yellow-500 rounded-full">
              <Calendar className="w-4 h-4 text-white" />
            </span>
            <h3 className="text-lg font-semibold">{t('about.journey1')}</h3>
            <p className="text-gray-600">
              {t('about.journey1_desc')}
            </p>
          </div>

          {/* Timeline Item 2 */}
          <div className="mb-10 ml-6">
            <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-yellow-500 rounded-full">
              <Calendar className="w-4 h-4 text-white" />
            </span>
            <h3 className="text-lg font-semibold">{t('about.journey2')}</h3>
            <p className="text-gray-600">
              {t('about.journey2_desc')}
            </p>
          </div>

          {/* Timeline Item 3 */}
          <div className="ml-6">
            <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-yellow-500 rounded-full">
              <Calendar className="w-4 h-4 text-white" />
            </span>
            <h3 className="text-lg font-semibold">{t('about.journey3')}</h3>
            <p className="text-gray-600">
              {t('about.journey3_desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">{t('about.why_choose')}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-gray-50 rounded-lg shadow">
            <ul className="space-y-3 text-gray-700">
              <li>{t('about.why1')}</li>
              <li>{t('about.why2')}</li>
              <li>{t('about.why3')}</li>
              <li>{t('about.why4')}</li>
            </ul>
          </div>
          <div>
            <img
              src="https://3mt.netlify.app/images/gallery/g2.jpg"
              alt="Our Work"
              loading="lazy"
              decoding="async"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <h2 className="text-2xl font-bold mb-4">
          {t('about.cta_title')}
        </h2>
        <a
          href="/contact"
          className="bg-yellow-500 text-white px-6 py-3 rounded-lg shadow hover:bg-yellow-600 transition font-semibold"
        >
          {t('about.cta_btn')}
        </a>
      </section>
    </div>
  );
}
