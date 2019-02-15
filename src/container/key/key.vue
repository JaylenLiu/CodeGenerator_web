<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>键值管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container" ref="container">
            <div class="handle-box">            
                <el-row :gutter="64">
                  <el-col :span="8">
                      <keyname-tree/>
                  </el-col>
                  <el-col :span="16">
                      <keyvalue-table/>
                  </el-col>
                </el-row>
            </div>
        </div>
        
    </div>
    
</template>

<script>
 import keynameTree from "./keynameTree";
 import keyvalueTable from "./keyvalueTable";
  export default {
    name: 'key',
    data() {
        return {
            
        }
    },
    created() {
        
    },
    mounted () {
        // 获取屏幕宽度和高度
        // let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        // let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        this.$refs.container.style.height = '680px';  
    },
    computed: {
    },
    methods: {
        
    },
    components: {
        keynameTree,
        keyvalueTable
    }
  };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
    .container{
        margin-top: 10px;
    }
</style>