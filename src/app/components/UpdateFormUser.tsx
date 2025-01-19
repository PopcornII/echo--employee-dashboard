'use client';

import { useEffect, useState } from 'react';
import { useLoginStore } from '../store/useAuthStore';
import { formatDate } from './FormatDate';



interface RegisterModalProps {
  userId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSelectedUser: {
    id: number;
    name: string;
    email: string;
    role: number;
    created_at: string | null;
  }
}


const UpdateUserModal: React.FC<RegisterModalProps> = ({ userId,onSelectedUser, isOpen, onClose, onSuccess}) => {
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: null,
    created_at: '',
  });
  

  const { user } = useLoginStore()
 
  // Fetch the initial user data when the modal is opened
  useEffect(() => {
    if (onSelectedUser) {
      setForm(onSelectedUser);
    } else {
      setForm({ name: '', email: '', role: 0, created_at: '',});
    }

  },[]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`/api/users/id?id=${userId}`, {
      method: 'PUT',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    if (response.ok) {
      setForm({ name: '', email: '', role: null, created_at: '' });
      setMessage('Registration successful!');
      onSuccess();
      onClose();
    } else {
      setMessage(data.message || 'An error occurred.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
             Ful Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              disabled
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm"
              required
            >
              <option value="" disabled>
                Select Role
              </option>
                <option value="3">Teacher</option>
                <option value="4">Student</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="created_at" className="block text-md font-bold text-white mb-1">
            Created At
            </label>
            <input
            type="text"
            id="created_at"
            name="created_at"
            value={formatDate(user.created_at)}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
            />
        </div>
          <div className="mb-4 flex justify-between">
            <button
              type="button"
              className="w-36 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-36 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Update
            </button>
          </div>
        </form>
        {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default UpdateUserModal;
