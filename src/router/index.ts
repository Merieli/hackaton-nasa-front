import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const Home = () => import('../views/FireOcurrencesPage.vue');
const ReportFire = () => import('../views/ReportFirePage.vue');

export const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: Home,
    },
    {
        path: '/report',
        name: 'ReportFire',
        component: ReportFire,
        meta: {
            hasAuth: true,
        },
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: { name: 'home' },
    },
];

const router = createRouter({
    history: createWebHistory('/'),
    routes,
});

export default router;
