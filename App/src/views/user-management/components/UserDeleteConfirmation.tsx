import React from 'react'
import { ConfirmDialog } from '@/components/shared'
import { toggleDeleteConfirmation } from '../store/stateSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { deleteUser, getUsers } from '../store/userListSlice'

const UserDeleteConfirmation: React.FC = () => {
    const dispatch = useDispatch()
    const dialogOpen = useSelector(
        (state: RootState) => state.userList?.state?.deleteConfirmation
    )
    const selectedUser = useSelector(
        (state: RootState) => state.userList?.state?.selectedUser
    )
    const tableData = useSelector(
        (state: RootState) => state.userList?.data?.tableData
    )

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmation(false))
    }

    const onDelete = async () => {
        dispatch(toggleDeleteConfirmation(false))
        if (selectedUser) {
            await dispatch(deleteUser(selectedUser.id as string))
            dispatch(getUsers(tableData))
        }
    }

    return (
        <ConfirmDialog
            isOpen={dialogOpen}
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            type="danger"
            title="Delete user"
            onCancel={onDialogClose}
            onConfirm={onDelete}
            confirmButtonColor="red-600"
        >
            <p>
                Are you sure you want to delete this user? This action cannot be
                undone.
            </p>
        </ConfirmDialog>
    )
}

export default UserDeleteConfirmation
