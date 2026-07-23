import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function ProfileModal({ isOpen, onClose }) {
  const { logout, updateProfile, user } = useAuth();
  const wasOpenRef = useRef(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user && isOpen && !wasOpenRef.current) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        address: user.address || '',
      });
      setError('');
      setSuccess('');
    }

    wasOpenRef.current = isOpen;
  }, [isOpen, user]);

  if (!isOpen || !user) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      await updateProfile(form);
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-yellow-700">My Profile</p>
            <h2 className="text-2xl font-black text-gray-900">{user.name || 'Customer'}</h2>
            <p className="mt-1 text-sm text-gray-500">
              {user.authProvider === 'google' ? 'Google account' : 'Customer account'}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close profile"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-5 rounded-md bg-gray-50 p-4 text-sm text-gray-700">
          <p><span className="font-semibold">Email:</span> {user.email || 'Not added'}</p>
          <p><span className="font-semibold">Phone:</span> {user.phone || 'Not added'}</p>
          <p>
            <span className="font-semibold">Verified:</span>{' '}
            {user.verifiedEmail ? 'Email' : user.verifiedPhone ? 'Phone' : user.isVerified ? 'Account' : 'Pending'}
          </p>
        </div>

        {error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {success && <p className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="text"
              value={form.firstName}
              onChange={(event) => setForm({ ...form, firstName: event.target.value })}
              placeholder="First name"
              className="w-full rounded-md border border-gray-300 px-3 py-3 outline-none focus:border-yellow-500"
            />
            <input
              type="text"
              value={form.lastName}
              onChange={(event) => setForm({ ...form, lastName: event.target.value })}
              placeholder="Last name"
              className="w-full rounded-md border border-gray-300 px-3 py-3 outline-none focus:border-yellow-500"
            />
          </div>
          <input
            type="tel"
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
            placeholder="Phone"
            className="w-full rounded-md border border-gray-300 px-3 py-3 outline-none focus:border-yellow-500"
          />
          <textarea
            value={form.address}
            onChange={(event) => setForm({ ...form, address: event.target.value })}
            placeholder="Address"
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-3 outline-none focus:border-yellow-500"
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 rounded-md bg-gray-900 py-3 font-bold text-white hover:bg-yellow-500 hover:text-gray-900 disabled:opacity-60"
            >
              {isSaving ? 'Saving...' : 'Save profile'}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md border border-red-200 px-5 py-3 font-bold text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileModal;
