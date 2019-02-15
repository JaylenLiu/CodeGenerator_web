<template>
	<div>
		<el-form ref="entityForm" :model="form" :rules="rules" label-width="100px">
			<el-form-item label="数据库连接" prop="connId">
				<el-select placeholder="请选择" v-model="form.connId" @change="connSelected" size="medium">
					<el-option
						auto-complete="off"
						v-for="item in connOptions"
						:key="item.id"
						:label="item.connName"
						:value="item.id">
					</el-option>
				</el-select>    
			</el-form-item>
			<el-form-item label="数据库" prop="databaseName" v-if="this.form.connId !== ''">
				<el-select placeholder="请选择" v-model="form.databaseName" @change="databaseSelected" size="medium">
					<el-option
						v-for="item in databaseOptions"
						:key="item"
						:label="item"
						:value="item">
					</el-option>
				</el-select>    
			</el-form-item>
			<el-form-item label="表名" prop="tableNames" v-if="this.form.databaseName !== ''">
				<el-select placeholder="请选择" v-model="form.tableNames" multiple 	size="medium">
					<el-option
						v-for="item in tableOptions"
						:key="item" 
						:label="item"
						:value="item">
					</el-option>
				</el-select>    
			</el-form-item>
		</el-form>
		<el-row type="flex" justify="center">
			<el-button type="primary"  @click="submitForm('entityForm')">保存</el-button>
		</el-row>
	</div>
</template>
<script type="text/javascript">
import http from '@util/http';
export default {
	data() {
		return {
			form: {
				connId: this.$store.state.entity.conId,
				databaseName: this.$store.state.entity.databaseName,
				tableNames: [],
			},
			connOptions:[],
			databaseOptions:[],
			tableOptions:[],
			rules: {
				connId: [
					{ required: true, message: '请选择数据库连接', trigger: 'change' }
				],
				databaseName: [
					{ required: true, message: '请选择数据库名称', trigger: 'change' }
				],
				tableNames: [
					{ required: true, message: '请选择表名', trigger: 'change' }
				]
			}
		};
	},
	created() {
		this.getConnOptions();
	},
	computed: {
        connId(){
            return this.$store.state.entity.conId;
		},
		databaseName(){
			return this.$store.state.entity.databaseName;
		},
		tableNames(){
			return this.$store.state.entity.tableNames;
		}
    },
	watch: {
		connId: function(val){
			this.form.connId = val;
		},
		databaseName: function(val){
			this.form.databaseName = val;
		},
		tableNames: function(val){
			this.form.tableNames = val;
		}
	},
	methods: {
		connSelected(value){
			this.getDatabaseOptions(value);
		},

		databaseSelected(databaseName){
			this.getTableOptions(this.form.connId, databaseName);
		},
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				Object.assign(this.form,{
                    schemaId: this.$store.state.schema.schemaData.id
				});
				http.post('agileEntites', this.form).then((ret)=>{
					if(ret.httpCode === 200){
						this.$message({
							type: 'success',
							message: '保存成功！'
						});
						this.$refs[formName].clearValidate();
						this.$emit('step');
					} else {
						this.$message({
							type: 'error',
							message: ret.message
						});   
					}
				});
			});
		},

		// 获取数据库连接选项
		getConnOptions(){
			http.get('databaseConnections', {}).then((result)=>{
				if (result.httpCode === 200) {
					this.connOptions = result.data;
				} else {
					this.$message({
						type: 'error',
						message: result.message
					});   
				}
			});
		},
		// 获取数据库名选项
		getDatabaseOptions(connId){
			http.get('databases', {conId:connId}).then((result)=>{
				if (result.httpCode === 200) {
					this.databaseOptions = result.data;
				} else {
					this.$message({
						type: 'error',
						message: result.message
					});   
				}
			});
		},
		// 获取表名选项
		getTableOptions(connId, databaseName){
			http.get('tables', 
				{
					conId:connId,
					databaseName: databaseName
				}).then((result)=>{
				if (result.httpCode === 200) {
					this.tableOptions = result.data;
				} else {
					this.$message({
						type: 'error',
						message: result.message
					});   
				}
			});
		}
	}
}
</script>
<style type="text/css" scoped>

</style>
