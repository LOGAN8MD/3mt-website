function PrivacyPolicy() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-yellow-700">
            Privacy Policy
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            3MT Machine Tools Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Last updated: July 4, 2026
          </p>

          <div className="mt-8 space-y-8 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900">
                Overview
              </h2>
              <p className="mt-3 leading-7">
                3MT Machine Tools provides a product catalog and enquiry
                experience for customers. This policy explains how the website
                uses network access and how enquiry information is handled.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">
                Internet Usage
              </h2>
              <p className="mt-3 leading-7">
                The website uses internet access to load product information,
                product images, company details, and related application
                content from our backend services and image hosting services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">
                WhatsApp Enquiries
              </h2>
              <p className="mt-3 leading-7">
                The website can open WhatsApp when you choose to send an
                enquiry. Product or cart enquiry details are prepared only to
                help you contact 3MT Machine Tools. These details are sent to
                WhatsApp only when you choose to continue and send the message
                through WhatsApp.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">
                Device Permissions
              </h2>
              <p className="mt-3 leading-7">
                The website does not request access to your camera, location,
                microphone, contacts, or storage.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900">
                Contact
              </h2>
              <p className="mt-3 leading-7">
                For privacy questions, contact us at{' '}
                <a
                  href="mailto:deepak.mishra2327@gmail.com"
                  className="font-medium text-yellow-700 underline hover:text-yellow-800"
                >
                  deepak.mishra2327@gmail.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
