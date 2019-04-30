import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { requireAuth:true },
            children:[
                {
                    // 首页
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '首页'}
                },
                {
                    // 账户信息
                    path: '/account',
                    component: resolve => require(['../container/account/account.vue'], resolve),
                    meta: { title: '账户管理'}
                },
                {
                    // 角色信息
                    path: '/role',
                    component: resolve => require(['../container/role/role.vue'], resolve),
                    meta: { title: '角色管理'}
                },
                {
                    // 组织管理
                    path: '/organization',
                    component: resolve => require(['../container/organization/organization.vue'], resolve),
                    meta: { title: '组织管理'}
                },
                {
                    // 资源管理
                    path: '/resource',
                    component: resolve => require(['../container/resource/resource.vue'], resolve),
                    meta: { title: '资源管理'}
                },
                {
                    // 资源分配
                    path: '/resAssignment',
                    component: resolve => require(['../container/resource/resAssignment.vue'], resolve),
                    meta: { title: '资源分配'}
                },
                {
                    path: '/roleAssignment',
                    component: resolve => require(['../container/role/roleAssignment.vue'], resolve),
                    meta: { title: '角色分配'}
                },
                {
                    path: '/key',
                    component: resolve => require(['../container/key/key.vue'], resolve),
                    meta: { title: '字典配置'}
                },
                {
                    // 智能表单
                    path: '/generateForm',
                    component: resolve => require(['../container/generateForm/generateForm.vue'], resolve),
                    meta: { title: '智能表单'}
                },
                {
                    path:'/databaseConn',
                    component: resolve => require(['../container/databaseCon/databaseCon.vue'], resolve),
                    meta: { title: '数据库连接管理'}
                },
                {
                    path: '/tabs',
                    component: resolve => require(['../components/page/Tabs.vue'], resolve),
                    meta: { title: '消息通知'}
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/404',
            component: resolve => require(['../components/page/404.vue'], resolve)
        },
        {
            path: '/403',
            component: resolve => require(['../components/page/403.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
