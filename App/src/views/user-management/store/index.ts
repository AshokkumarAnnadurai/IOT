import { combineReducers } from '@reduxjs/toolkit'
import data, { UserListState } from './userListSlice'
import state, { State } from './stateSlice'
import addUser, { AddUserState } from './addUserSlice'

const reducer = combineReducers({
    data,
    state,
    addUser,
})

export type UserManagementState = {
    data: UserListState
    state: State
    addUser: AddUserState
}

export default reducer
