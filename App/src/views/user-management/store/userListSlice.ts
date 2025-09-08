import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetUsers, apiDeleteUser } from '@/services/UserManagementService'
import type { TableQueries, User } from '@/@types/common'

type Users = User[]

type GetUsersResponse = {
    data: Users
    total: number
}

export type UserListState = {
    loading: boolean
    users: Users
    tableData: TableQueries
}

export const SLICE_NAME = 'userList'

export const getUsers = createAsyncThunk(
    SLICE_NAME + '/getUsers',
    async (data: TableQueries) => {
        const response = await apiGetUsers(data)
        return response.data
    }
)

export const deleteUser = createAsyncThunk(
    SLICE_NAME + '/deleteUser',
    async (id: string) => {
        await apiDeleteUser(id)
        return id
    }
)

const initialState: UserListState = {
    loading: false,
    users: [],
    tableData: {
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        query: '',
        sort: {
            order: '',
            key: '',
        },
    },
}

const userListSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUsers.fulfilled, (state, action) => {
                state.users = action.payload.data
                state.tableData.total = action.payload.total
                state.loading = false
            })
            .addCase(getUsers.pending, (state) => {
                state.loading = true
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(
                    (user) => user.id !== action.payload
                )
            })
    },
})

export const { setTableData } = userListSlice.actions

export default userListSlice.reducer
