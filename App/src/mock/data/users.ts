import { ADMIN, USER } from '@/constants/roles.constant'
import { User } from '@/@types/common'

const usersData: User[] = [
    {
        id: '1',
        name: 'Carolyn Perkins',
        email: 'carolyn.perkins@example.com',
        authority: [ADMIN],
        avatar: '/img/avatars/thumb-1.jpg',
    },
    {
        id: '2',
        name: 'Terrance Moreno',
        email: 'terrance.moreno@example.com',
        authority: [USER],
        avatar: '/img/avatars/thumb-2.jpg',
    },
    {
        id: '3',
        name: 'Ron Vargas',
        email: 'ron.vargas@example.com',
        authority: [USER],
        avatar: '/img/avatars/thumb-3.jpg',
    },
    {
        id: '4',
        name: 'Luke Cook',
        email: 'luke.cook@example.com',
        authority: [USER],
        avatar: '/img/avatars/thumb-4.jpg',
    },
    {
        id: '5',
        name: 'Joyce Freeman',
        email: 'joyce.freeman@example.com',
        authority: [USER],
        avatar: '/img/avatars/thumb-5.jpg',
    },
    {
        id: '6',
        name: 'Samantha Phillips',
        email: 'samantha.phillips@example.com',
        authority: [USER],
        avatar: '/img/avatars/thumb-6.jpg',
    },
    {
        id: '7',
        name: 'Tara Fletcher',
        email: 'tara.fletcher@example.com',
        authority: [USER],
        avatar: '/img/avatars/thumb-7.jpg',
    },
    {
        id: '8',
        name: 'Frederick Adams',
        email: 'frederick.adams@example.com',
        authority: [USER],
        avatar: '/img/avatars/thumb-8.jpg',
    },
    {
        id: '9',
        name: 'Carolyn Hanson',
        email: 'carolyn.hanson@example.com',
        authority: [USER],
        avatar: '/img/avatars/thumb-9.jpg',
    },
    {
        id: '10',
        name: 'Brittany Hale',
        email: 'brittany.hale@example.com',
        authority: [USER],
        avatar: '/img/avatars/thumb-10.jpg',
    },
]

export default usersData
