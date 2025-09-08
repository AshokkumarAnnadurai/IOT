import React, { useEffect, useMemo } from 'react'
import { Avatar, Badge } from '@/components/ui'
import { DataTable } from '@/components/shared'
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { User } from '@/@types/common'
import { setSelectedUser, toggleDeleteConfirmation } from '../store/stateSlice'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { useNavigate } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import { getUsers, setTableData } from '../store/userListSlice'

const UserColumn = ({ row }: { row: User }) => {
    const { textTheme } = useThemeClass()
    const navigate = useNavigate()

    const onView = () => {
        navigate(`/app/user/${row.id}`)
    }

    return (
        <div className="flex items-center">
            <Avatar size={28} shape="circle" src={row.avatar} />
            <span
                className={`hover:${textTheme} ml-2 rtl:mr-2 font-semibold`}
                onClick={onView}
            >
                {row.name}
            </span>
        </div>
    )
}

const ActionColumn = ({ row }: { row: User }) => {
    const dispatch = useDispatch()
    const { textTheme } = useThemeClass()
    const navigate = useNavigate()

    const onEdit = () => {
        navigate(`/app/user/edit/${row.id}`)
    }

    const onDelete = () => {
        dispatch(toggleDeleteConfirmation(true))
        dispatch(setSelectedUser(row))
    }

    return (
        <div className="flex justify-end text-lg">
            <span
                className={`cursor-pointer p-2 hover:${textTheme}`}
                onClick={onEdit}
            >
                <HiOutlinePencil />
            </span>
            <span
                className="cursor-pointer p-2 hover:text-red-500"
                onClick={onDelete}
            >
                <HiOutlineTrash />
            </span>
        </div>
    )
}

const UserTable = () => {
    const dispatch = useDispatch()
    const tableData = useSelector(
        (state: RootState) => state.userList?.data?.tableData
    )
    const loading = useSelector(
        (state: RootState) => state.userList?.data?.loading
    )
    const users = useSelector((state: RootState) => state.userList?.data?.users)

    const { pageIndex, pageSize, sort, query, total } = tableData || {}

    useEffect(() => {
        if (pageIndex !== undefined) {
            fetchData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize, sort, query])

    const fetchData = () => {
        dispatch(getUsers({ pageIndex, pageSize, sort, query }))
    }

    const columns = useMemo(
        () => [
            {
                header: 'User',
                accessorKey: 'name',
                cell: (props: any) => {
                    const row = props.row.original
                    return <UserColumn row={row} />
                },
            },
            {
                header: 'Email',
                accessorKey: 'email',
            },
            {
                header: 'Role',
                accessorKey: 'authority',
                cell: (props: any) => {
                    const row = props.row.original
                    return (
                        <div className="flex items-center">
                            <Badge className="capitalize">
                                {row.authority?.[0]}
                            </Badge>
                        </div>
                    )
                },
            },
            {
                header: '',
                id: 'action',
                cell: (props: any) => <ActionColumn row={props.row.original} />,
            },
        ],
        []
    )

    const onPaginationChange = (page: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = page
        dispatch(setTableData(newTableData))
    }

    const onSelectChange = (value: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageSize = value
        newTableData.pageIndex = 1
        dispatch(setTableData(newTableData))
    }

    const onSort = (sort: { order: 'asc' | 'desc' | ''; key: string | number }) => {
        const newTableData = cloneDeep(tableData)
        newTableData.sort = sort
        dispatch(setTableData(newTableData))
    }

    return (
        <>
            <DataTable
                columns={columns}
                data={users || []}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 28, height: 28 }}
                loading={loading}
                pagingData={{
                    total: total || 0,
                    pageIndex: pageIndex || 1,
                    pageSize: pageSize || 10,
                }}
                onPaginationChange={onPaginationChange}
                onSelectChange={onSelectChange}
                onSort={onSort}
            />
        </>
    )
}

export default UserTable