import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { subscribeToApiDelay } from '../utils/apiDelayNotifier';

function ServerWakeupPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => subscribeToApiDelay(setIsVisible), []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 px-4 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="w-full max-w-md rounded-lg border border-yellow-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="mt-1 rounded-full bg-yellow-100 p-2 text-yellow-700">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Checking updates in our application
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-700">
              Our server may take around 50 seconds to one minute.
              <br />
              Sorry for making you wait.
            </p>
            <p className="mt-3 text-sm font-medium leading-6 text-gray-800">
              Please keep the app open. Your data will load automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServerWakeupPopup;
