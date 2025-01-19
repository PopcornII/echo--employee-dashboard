'use client'

import React from 'react';
import { useLoginStore } from '../store/useAuthStore';
import { formatDate } from './FormatDate';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'antd';


const UserProfileForm: React.FC = () => {
  const { user } = useLoginStore();
  return (
    <form className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-4 text-center">Profile</h1>
      <div className="mb-4 text-center">
        <Space size={16}>
          <Avatar size={96} icon={<UserOutlined />} />
        </Space>
      
      </div>

      {/* ID Field */}
      <div className="mb-4">
        <label htmlFor="id" className="block text-sm font-bold text-white mb-1">
          ID
        </label>
        <input
          type="text"
          id="id"
          name="id"
          value={user.id}
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
        />
      </div>

      {/* Name Field */}
      <div className="mb-4">
        <label htmlFor="name" className="block text-md font-bold text-white mb-1">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={user.name}
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
        />
      </div>

      {/* Email Field */}
      <div className="mb-4">
        <label htmlFor="email" className="block text-md font-bold text-white mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={user.email}
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
        />
      </div>

      {/* Role Field */}
      <div className="mb-4">
        <label htmlFor="role" className="block text-md text-white mb-1 font-bold">
          Role
        </label>
        { 
            user.role === 1 && (
              <input
                type="text"
                id="role"
                name="role"
                value="System Admin"
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
              />
            ) 
            ||
            (
                user.role === 2 && (
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value="Admin"
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                  />
                )
            ) 
            ||   
            (
                user.role === 3 && (
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value="Teacher"
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                  />
                )
            )
            ||
            (
                user.role === 4 && (
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value="Student"
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                  />
                )
            )

            
        }
        
      </div>

      {/* Created At Field */}
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
    </form>
  );
};

export default UserProfileForm;
