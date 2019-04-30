<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff" 
            unique-opened
            router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
                            {{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import {get} from '@util/http';
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                items: [
                    {
                        icon: "el-icon-menu",
                        index: "1",
                        title: "基础管理",
                        subs: [
                            {
                                icon: "el-icon-menu",
                                index: "roleAssignment",
                                title: "角色分配"
                            },
                            {
                                icon: "el-icon-menu",
                                index: "resAssignment",
                                title: "资源分配"
                            },
                            {
                                icon: "el-icon-menu",
                                index: "account",
                                title: "账户管理"
                            },
                            {
                                icon: "el-icon-menu",
                                index: "role",
                                title: "角色管理"
                            },
                            {
                                icon: "el-icon-menu",
                                index: "organization",
                                title: "组织管理"
                            },
                            {
                                icon: "el-icon-menu",
                                index: "resource",
                                title: "资源管理"
                            },
                            {
                                icon: "el-icon-menu",
                                index: "key",
                                title: "字典管理"
                            }
                        ]
                    },
                    {
                        icon: "el-icon-menu",
                        index: "2",
                        title: "代码生成",
                        subs: [
                            {
                                icon: "el-icon-menu",
                                index: "generateForm",
                                title: "代码生成器"
                            }
                        ]
                    },
                    {
                        icon: "el-icon-menu",
                        index: "databaseConn",
                        title: "数据库管理"
                    }
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            });
            // this.initData();
        },
        methods: {
             // 初始化数据
            // initData() {
            //     // 请求资源树
            //     get('resTree', {}).then((res)=>{
            //         if (res.ret === 200) {
            //            this.items = res.data;
            //         } else {
            //             this.$message({
            //                 type: 'error',
            //                 message: ret.message
            //             });  
            //         }
            //     });
            // }
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 50px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 170px;
    }
    .sidebar > ul {
        height:180%;
    }
</style>
<style type="text/css">
.el-submenu .el-menu-item {
    height: 50px;
    line-height: 50px;
    padding: 0 45px;
    min-width: 170px;
}
</style>
