<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-message"></i> 消息通知</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="message">
                <el-tab-pane :label="`消息列表(${msgData.length})`" name="first">
                    <el-table :data="msgData" :show-header="false" style="width: 100%">
                        <el-table-column>
                            <template slot-scope="scope">
                                <span class="message-title">{{scope.row.content}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" width="180"></el-table-column>
                        <el-table-column width="120">
                            <template slot-scope="scope">
                                <el-button size="small" @click="handleRead(scope.row.id)">标为已读</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="handle-row">
                        <el-button type="primary" @click="readAllNotice()">全部标为已读</el-button>
                    </div>
                </el-tab-pane>

                <el-tab-pane :label="`已读消息(${readedMsgData.length})`" name="second">
                    <template v-if="message === 'second'">
                        <el-table :data="readedMsgData" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <span class="message-title">{{scope.row.content}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="createTime" width="180"></el-table-column>
                            <el-table-column width="120">
                                <template slot-scope="scope">
                                    <el-button type="danger" @click="handleDel(scope.row.id)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="handle-row">
                            <el-button type="danger" @click="deleteAllNotice()">删除全部</el-button>
                        </div>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import http from '@util/http';
    export default {
        name: 'tabs',
        data() {
            return {
                message: 'first',
                showHeader: false,
                msgData: [],
                readedMsgData:[]
            }
        },
        created() {
            this.initData();
        },
        methods: {
           // 初始化数据
            initData() {
                http.get('sysNotice/state/1', {}).then((ret)=>{
                    if(ret.httpCode === 200){
                        this.msgData = ret.data;
                        this.$store.dispatch('changeNum', this.msgData.length);
                    } else {
                        this.$message({
                            type: 'error',
                            message: ret.message
                        });
                    }
                });
                http.get('sysNotice/state/2', {}).then((ret)=>{
                    if(ret.httpCode === 200){
                        this.readedMsgData = ret.data;
                    } else {
                        this.$message({
                            type: 'error',
                            message: ret.message
                        });
                    }
                });
            },
            handleRead(id){
                http.put('sysNotice/state', {
                    id: id,
                    state: 2
                }).then((ret)=>{
                    if(ret.httpCode === 200){
                        this.initData();
                    } else {
                        this.$message({
                            type: 'error',
                            message: ret.message
                        });
                    }
                });
            },
            handleDel(id){
                http.put('sysNotice/state', {
                    id: id,
                    state: 3
                }).then((ret)=>{
                    if(ret.httpCode === 200){
                        this.initData();
                    } else {
                        this.$message({
                            type: 'error',
                            message: ret.message
                        });
                    }
                });
            },
            readAllNotice(){
                http.put('sysNotice/readAll', {}).then((ret)=>{
                    if(ret.httpCode === 200){
                        this.$store.dispatch('changeNum', 0);
                        this.initData();
                    } else {
                        this.$message({
                            type: 'error',
                            message: ret.message
                        });
                    }
                });
            },
            deleteAllNotice(){
                http.put('sysNotice/deleteAll', {}).then((ret)=>{
                    if(ret.httpCode === 200){
                        this.initData();
                    } else {
                        this.$message({
                            type: 'error',
                            message: ret.message
                        });
                    }
                });
            }
        },
    }

</script>

<style>
.message-title{
    cursor: pointer;
}
.handle-row{
    margin-top: 30px;
}
</style>

