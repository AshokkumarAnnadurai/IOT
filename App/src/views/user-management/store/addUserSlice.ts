import { createSlice } from '@reduxjs/toolkit'

export type AddUserState = {
    dialogOpen: boolean
}

const initialState: AddUserState = {
    dialogOpen: false,
}

const addUserSlice = createSlice({
    name: 'addUser',
    initialState,
    reducers: {
        openDialog: (state) => {
            state.dialogOpen = true
        },
        closeDialog: (state) => {
            state.dialogOpen = false
        },
    },
})

export const { openDialog, closeDialog } = addUserSlice.actions
export default addUserSlice.reducer
