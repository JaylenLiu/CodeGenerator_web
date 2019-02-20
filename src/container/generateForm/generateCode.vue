<template>
	<div class="generate">
		<el-form ref="generateCodeForm" :model="form" label-width="80px">
			<el-form-item label="模块名称" prop="moduleName">
				<el-input v-model="form.moduleName" disabled></el-input>
			</el-form-item>
			<el-form-item label="包路径" prop="packagePath">
				<el-input v-model="form.packagePath" disabled></el-input>
			</el-form-item>
			
			<el-form-item label="代码类别" prop="generateList">
				<el-checkbox-group v-model="form.generateList">
				<el-checkbox label="web">前端代码</el-checkbox>
				<el-checkbox label="java">后端代码</el-checkbox>
			</el-checkbox-group>
				
			</el-form-item>
		</el-form>
		<el-row type="flex" justify="center">
			<el-button type="primary"  @click="submitForm()">生成代码</el-button>
		</el-row>
	</div>
</template>
<script type="text/javascript">
import http from '@util/http';
export default {
	data() {
		return {
			form: {
				moduleName: '',
				packagePath: '',
				generateList: [],
			},
		};
	},
	computed: {
		moduleName(){
			return this.$store.state.schema.schemaData.moduleName;
		},
		packagePath(){
			return this.$store.state.schema.schemaData.packagePath;
		},
  },
	watch: {
		moduleName: function(val){
			this.form.moduleName = val;
		},
		packagePath: function(val){
			this.form.packagePath = val;
		}
	},
	methods: {
		submitForm() {
			if(!this.form.generateList){
				this.$message({
					type: 'warning',
					message: '请选择生成代码类型'
				});   
			} else {
				http.post('generateCode',{
					'schemaId': this.$store.state.schema.schemaData.id,
					'generateList': this.form.generateList,
				}).then(result=>{
					if(result.httpCode === 200){
						this.$message({
							type: 'success',
							message: '生成成功！'
						});   
					} else {
						this.$message({
							type: 'error',
							message: ret.message
						});   
					}
				});
			}
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
		}
	}
}
</script>
