'use client'

import React, { useEffect , useState} from 'react';
import UserProfileTable from '../../components/UserProfileTable';
import RegisterModal from '@/app/components/CreateFormUser';
import { Modal, message } from 'antd';
import UpdateUserModal from '@/app/components/UpdateFormUser';
import ConfirmDeleteDialog from '@/app/components/DeleteConfirmModal';

interface UserProfle {
    id: number;
    name: string;
    email: string;
    role: number;
    created_at: string;
  };


const Users: React.FC = () => {
    const [usersList, setUsersList] = useState<UserProfle[] | null>([]);
    const [selectedUser, setSelectedUser] = useState<UserProfle | ''>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    const [messageApi, contextHolder] = message.useMessage();

    const success = (messageBody: string) => {
        messageApi.open({
        type: 'success',
        content: messageBody,
        });
    
    };

    const error = (messageBody: string) => {
        messageApi.open({
        type: 'error',
        content: messageBody,
        });
        
    };

    const toggleModal = (() => setIsModalOpen(!isModalOpen));
    const toggleEditModal = (() => setIsEditModalOpen(!isEditModalOpen));
    const toggleDeleteModal = (() => setIsDeleteModalOpen(!isDeleteModalOpen));

    const handleEdit = (id: number) => {
        setSelectedUser(usersList.find((user) => user.id === id));
        setIsEditModalOpen(true);
    }

     const handleDelete = (id: number) => {
        setSelectedUser(usersList.find((user) => user.id === id));
        setIsDeleteModalOpen(true);
    }

    const fetchAllUsers = async () => {
        const response = await fetch('/api/users');
        if(response.ok){
            const data = await response.json();
            setUsersList(data.users);
        }else{
            throw new Error("getUsersList failed..")
        }
    }

    useEffect(() => {
        fetchAllUsers();
    },[]);


  return (
    <div className='fixed flex-col p-6 bg-gray-50 min-h-screen sm:w-3/4 lg:w-full'>
        {contextHolder}
        <div className='mb-2'>
            <h1 className="text-2xl font-bold m-2 mb-4"> User Management</h1>
            <button onClick={() => setIsModalOpen(true)} className='bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-200'>
                Add New User
            </button>
        </div>
        <div className='ml-6 min-h-screen sm:w-1/2 lg:w-5/6'>
            <UserProfileTable 
                users={usersList}
                handleEditUser={handleEdit}
                handleDeleteUser={handleDelete}
            />
        </div>

        {isModalOpen && 
        <RegisterModal
            isOpen={isModalOpen}
            onClose={toggleModal}
            onSuccess={() => {
                setIsModalOpen(false);
                success('User registered successfully');
                fetchAllUsers();
            }}
        />}

        {isEditModalOpen && selectedUser && 
            <UpdateUserModal
                userId = {selectedUser?.id || 0}
                isOpen={isEditModalOpen}
                onSelectedUser={selectedUser}
                onClose={toggleEditModal}
                onSuccess={() => {
                    toggleEditModal();
                    success('User updated successfully');
                    fetchAllUsers();
                }}
            />
        }
         { isDeleteModalOpen && selectedUser && (
            <ConfirmDeleteDialog
                title={`Are you sure you want to delete user: ${selectedUser?.name}?`}
                open={isDeleteModalOpen}
                onCancel={toggleDeleteModal}
                onOk={async () => {
                    const response = await fetch(`/api/users/id?id=${selectedUser.id}`, {
                        method: 'DELETE',
                    });
                    if(response.ok){
                        success("User deleted successfully..");
                        setUsersList(usersList.filter((user) => user.id!== selectedUser.id));
                        fetchAllUsers();
                        toggleDeleteModal();
                    }
                   
                    
                }}
                okText='Delete'
                cancelText='Cancel'
            />
        )
    }
       
    </div>
  );
};

export default Users;
