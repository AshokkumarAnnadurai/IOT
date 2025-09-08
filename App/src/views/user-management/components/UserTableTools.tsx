import React from 'react'
import { Button } from '@/components/ui'
import { HiPlusCircle } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'

const UserTableTools: React.FC = () => {
    const navigate = useNavigate()

    const onAddUser = () => {
        navigate('/user-management/new')
    }

    return (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
            <h3 className="mb-4 lg:mb-0">Users</h3>
            <Button
                size="sm"
                variant="solid"
                icon={<HiPlusCircle />}
                onClick={onAddUser}
            >
                Add User
            </Button>
        </div>
    )
}

export default UserTableTools
