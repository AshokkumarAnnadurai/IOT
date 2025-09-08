import type { Server } from 'miragejs'
import {
    Response
} from 'miragejs'

export default function userManagementFakeApi(server: Server, apiPrefix: string) {
    server.get(`${apiPrefix}/users`, (schema, request) => {
        const { pageIndex, pageSize, sort, query } = request.queryParams
        const page = parseInt(pageIndex as string) || 1
        const size = parseInt(pageSize as string) || 10
        const search = query as string

        let data = schema.db.usersData

        if (search) {
            data = data.filter((user) => {
                return user.name.toLowerCase().includes(search.toLowerCase())
            })
        }

        if (sort) {
            const { key, order } = JSON.parse(sort as string)
            data.sort((a, b) => {
                if (order === 'asc') {
                    return a[key] > b[key] ? 1 : -1
                }
                if (order === 'desc') {
                    return a[key] < b[key] ? 1 : -1
                }
                return 0
            })
        }

        const total = data.length
        const paginatedData = data.slice((page - 1) * size, page * size)

        return {
            data: paginatedData,
            total: total,
        }
    })

    server.get(`${apiPrefix}/user/:id`, (schema, request) => {
        const id = request.params.id
        const user = schema.db.usersData.find(id)
        return user || new Response(404, {}, {
            message: 'User not found!'
        })
    })

    server.post(`${apiPrefix}/users`, (schema, request) => {
        const data = JSON.parse(request.requestBody)
        schema.db.usersData.insert(data)
        return schema.db.usersData
    })

    server.put(`${apiPrefix}/user/:id`, (schema, request) => {
        const id = request.params.id
        const data = JSON.parse(request.requestBody)
        schema.db.usersData.update(id, data)
        return schema.db.usersData
    })

    server.del(`${apiPrefix}/user/:id`, (schema, request) => {
        const id = request.params.id
        schema.db.usersData.remove(id)
        return schema.db.usersData
    })
}
