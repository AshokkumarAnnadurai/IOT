import React from 'react'
import { injectReducer } from '@/store'
import userList from './store'
import UserList from './UserList'

injectReducer('userList', userList)

const UserListWithReducer: React.FC = () => {
    return <UserList />
}

export default UserListWithReducer
