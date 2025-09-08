import ApiService from './ApiService'
import type { User, TableQueries } from '@/@types/common'

export async function apiGetUsers(data: TableQueries) {
    return ApiService.fetchData<{
        data: User[]
        total: number
    }>({
        url: '/users',
        method: 'get',
        params: data,
    })
}

export async function apiGetUserById(id: string) {
    return ApiService.fetchData<User>({
        url: `/user/${id}`,
        method: 'get',
    })
}

export async function apiCreateUser(data: Omit<User, 'id'>) {
    return ApiService.fetchData<User>({
        url: '/users',
        method: 'post',
        data,
    })
}

export async function apiUpdateUser(id: string, data: Partial<User>) {
    return ApiService.fetchData<User>({
        url: `/user/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteUser(id: string) {
    return ApiService.fetchData<User>({
        url: `/user/${id}`,
        method: 'delete',
    })
}
