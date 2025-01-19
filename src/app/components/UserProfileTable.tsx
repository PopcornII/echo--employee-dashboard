

import React from 'react';
import { formatDate } from './FormatDate';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface User  {
  id: number;
  name: string;
  email: string;
  role: number;
  created_at: string;
};

interface UsersTableProps{
  users: User[];
  handleDeleteUser: (id: number) => void;
  handleEditUser: (id: number) => void;
};

const UsersProfileTable: React.FC<UsersTableProps> = ({users, handleDeleteUser, handleEditUser}) => {

  return (
    <div className="container flex flex-col p-2 bg-white rounded-lg shadow-md">
      <div className="max-h-[500px] overflow-y-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead className="sticky top-0 bg-white">
            <tr>
              <th className="border-b px-4 py-2 text-left text-sm font-bold text-gray-700">No</th>
              <th className="border-b px-4 py-2 text-left text-sm font-bold text-gray-700">Name</th>
              <th className="border-b px-4 py-2 text-left text-sm font-bold text-gray-700">Email</th>
              <th className="border-b px-4 py-2 text-left text-sm font-bold text-gray-700">Role</th>
              <th className="border-b px-4 py-2 text-left text-sm font-bold text-gray-700">Created At</th>
              <th className="border-b px-4 py-2 text-left text-sm font-bold text-gray-700">Operations</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border-b p-2">{index + 1}</td>
                <td className="border-b px-4 py-2 text-sm text-gray-700">{user.name}</td>
                <td className="border-b px-4 py-2 text-sm text-gray-700">{user.email}</td>
                <td className="border-b px-4 py-2 text-sm text-gray-700">{
                    user.role === 1 && 'System Admin'
                    || user.role === 2 && 'Admin'
                    || user.role === 3 && 'Lecture'
                    || user.role === 4 && 'Student'
                    || user.role === 5 && 'Guest'}
                </td>
                <td className="border-b px-4 py-2 text-sm text-gray-700">
                  {formatDate(user.created_at)}
                </td>
                <td className="border-b px-4 py-2 text-sm text-gray-700">
                  {/* Add operations here */}
                  <button 
                    type='button'
                    className="text-blue-500 hover:underline px-4"
                    onClick={() => handleEditUser(user.id)}
                  >
                     <FaEdit />
                    </button>
                  <button 
                  type='button'
                  className="text-red-500 hover:underline"
                  onClick = {() => handleDeleteUser(user.id)}
                  >
                    <FaTrash />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersProfileTable;
