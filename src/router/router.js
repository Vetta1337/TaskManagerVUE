import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import TaskDetail from '../views/TaskDetail.vue'
import EditTask from '../views/EditTask.vue'
import MakeTask from '@/views/MakeTask.vue';
import EditSubTask from '@/views/EditSubTask.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/task/:id',
        name: 'TaskDetail',
        component: TaskDetail,
        props: true

    },
    {
        path: '/editTask/:id',
        name: 'EditTask',
        component: EditTask,
        props: true
    },
    {
        path: '/makeTask/:id',
        name: 'MakeTask',
        component: MakeTask,
        props: true
    },
    {
        path: '/editSubTask/:id',
        name: 'EditSubTask',
        component: EditSubTask,
        props: true
    }
];

const router = createRouter({
    // eslint-disable-next-line no-undef
    history: createWebHistory(),
    routes,
}); 

export default router