<template>
	<div>
		<el-row :gutter="32">
		  <el-col :span="6">
			<!-- 左侧树 -->
			<span>选择已有的方案</span>
			<el-tree
				class="tree"
				:data="schemaOption"
				accordion
				default-expand-all
				highlight-current
				@node-click="handleNodeClick">
					<span class="custom-tree-node" slot-scope="{ node, data }">
						<span>{{ node.label }}</span>
						<span v-show="data.id != -1">
							<el-button
								type="text"
								size="mini"
								@click="() => remove(node, data)">
								删除
							</el-button>
						</span>
					</span>
			</el-tree>
		  </el-col>
		  <el-col :span="16">
			<el-form ref="schemaForm" :model="form" :rules="rules" label-width="100px">
				<el-form-item label="方案名称" prop="schemaName">
					<el-input v-model="form.schemaName"></el-input>
				</el-form-item>
				<el-form-item label="模块名称" prop="moduleName">
					<el-input v-model="form.moduleName"></el-input>
				</el-form-item>
				<el-form-item label="模块描述" prop="moduleDesc">
					<el-input type="textarea" v-model="form.moduleDesc"></el-input>
				</el-form-item>
				<el-form-item label="代码包路径" prop="packagePath">
					<el-input v-model="form.packagePath"></el-input>
				</el-form-item>
			</el-form>
		  </el-col>
		</el-row>
		<el-row type="flex" justify="center">
			<el-button type="primary"  @click="submitForm('schemaForm')">保存</el-button>
		</el-row>
	</div>
</template>
<script type="text/javascript">
import http from '@util/http';
export default {
	inject:['reload'],
	data() {
		return {
			form: {
				// 方案名称
				schemaName: '',
				// 模块名称
				moduleName: '',
				// 模块描述
				moduleDesc: '',
				// 包路径
				packagePath: '',
				// 方案类型
				// schemaType: '0'
			},
			schemaOption:[],
			rules: {
				schemaName: [
					{ required: true, message: '请输入方案名称', trigger: 'blur' }
				],
				moduleName: [
					{ required: true, message: '请输入模块名称', trigger: 'blur' }
				],
				packagePath: [
					{ required: true, message: '请输入包路径', trigger: 'blur' }
				],
			}
		};
	},
	created() {
		this.getSchemaTree();
	},
	methods: {
		// 删除节点
    remove(node, data) {
			if(data.id != -1){
				this.$confirm('您确定要删除数据吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
				}).then(() => {
					this.resetForm("schemaForm");
					//  请求后台删除数据
					http.del('agileSchema', {id:data.id}).then((ret)=>{
						if(ret.httpCode === 200){
							this.$message({
								type: 'success',
								message: '删除成功！'
							});   
							this.getSchemaTree();
							// this.resetState();
						} else {
							this.$message({
								type: 'error',
								message: ret.message
							});   
						}
					});
				})
			} 
		},
		// 清空state
		resetState(){
			this.$store.dispatch('saveSchema', {});
			this.$store.dispatch('saveConId', '');
			this.$store.dispatch('saveDatabaseName', '');
			this.$store.dispatch('saveTableNames', []);
		},
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					http.post('agileSchema', this.form).then((ret)=>{
						if(ret.httpCode === 200){
							this.$message({
								type: 'success',
								message: '新增成功！'
							});
							this.$refs[formName].clearValidate();
							this.$store.dispatch('saveSchema', ret.data);
							this.$emit('step');
						
						} else {
							this.$message({
								type: 'error',
								message: ret.message
							});   
						}
					});
				} 
			});
		},
		resetForm(formName) {
			this.$refs[formName].clearValidate();
			this.$refs[formName].resetFields();
		},
		handleNodeClick(data) {
			if(data.id != -1){
				http.get('agileSchema', {id:data.id}).then((result)=>{
					if (result.httpCode === 200) {
						this.form = {
							schemaName: result.data.schemaName,
							moduleName: result.data.moduleName,
							moduleDesc: result.data.moduleDesc,
							packagePath: result.data.packagePath,
						}
						this.$store.dispatch('saveSchema', result.data);

						http.get('agileEntityBySchemaId',{schemaId: this.$store.state.schema.schemaData.id}).then((result=>{
							if(result.httpCode === 200){
								if(result.data.length != 0){
									let tableNames = result.data.map(item=>{return item.tableName});
									this.$store.dispatch('saveConId', result.data[0].conId);
									this.$store.dispatch('saveDatabaseName', result.data[0].databaseName);
									this.$store.dispatch('saveTableNames', tableNames);
								}
								
							} else {
								this.$message({
									type: 'error',
									message: result.message
								});   
							}
						}));
					} else {
						this.$message({
							type: 'error',
							message: result.message
						});   
					}
				});
			}
		},
		getSchemaTree(){
			http.get('schemaTree', {}).then((result)=>{
				if (result.httpCode === 200) {
					this.schemaOption = result.data;
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


<style scoped>
    .tree{
        max-height: 680px;
        overflow-y: scroll;
    }
	.custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
</style>
