import { createSlice } from '@reduxjs/toolkit'
import { User } from '@/@types/common'

export type State = {
    deleteConfirmation: boolean
    selectedUser: Partial<User>
}

const initialState: State = {
    deleteConfirmation: false,
    selectedUser: {},
}

const stateSlice = createSlice({
    name: 'userList/state',
    initialState,
    reducers: {
        toggleDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload
        },
    },
})

export const { toggleDeleteConfirmation, setSelectedUser } = stateSlice.actions

export default stateSlice.reducer
