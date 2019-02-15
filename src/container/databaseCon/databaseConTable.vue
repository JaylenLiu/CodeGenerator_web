<template>
    <div class="table">
        <div>
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="columnName" label="字段名称"></el-table-column>
                <el-table-column prop="typeName" label="类型"></el-table-column>
                <el-table-column prop="columnSize" label="字段长度"></el-table-column>
                <el-table-column prop="decimalDigits" label="小数位长度"></el-table-column>
                <el-table-column prop="nullable" label="是否可以为空"></el-table-column>
                <el-table-column prop="remarks" label="备注"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import {get, put, post, del} from '@util/http';
    export default {
        name: 'databaseConnTable',
        data() {
            return {
            }
        },
        created() {
           
        },
        computed: {
            tableData(){
                return this.$store.state.databaseCon.fieldData;
            },
            conData(){
                return this.$store.state.databaseCon.conData;
            }
        },
        methods: {
        
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 13px;
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
    .container{
        margin-top: 10px;
    }
</style>
