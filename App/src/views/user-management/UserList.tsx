import React from 'react'
import { AdaptableCard } from '@/components/shared'
import UserTable from './components/UserTable'
import UserTableTools from './components/UserTableTools'
import UserDeleteConfirmation from './components/UserDeleteConfirmation'

const UserList: React.FC = () => {
    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <UserTableTools />
            <UserTable />
            <UserDeleteConfirmation />
        </AdaptableCard>
    )
}

export default UserList
