<template>
	<div class="generate">
		<el-form ref="generateCodeForm" :model="form" label-width="80px">
			<el-form-item label="方案名称" prop="schemaName">
				<el-input v-model="form.schemaName" disabled></el-input>
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
import { Loading } from 'element-ui';
export default {
	data() {
		return {
			form: {
				schemaName: '',
				packagePath: '',
				generateList: [],
			},
		};
	},
	computed: {
		schemaName(){
			return this.$store.state.schema.schemaData.schemaName;
		},
		packagePath(){
			return this.$store.state.schema.schemaData.packagePath;
		},
  },
	watch: {
		schemaName: function(val){
			this.form.schemaName = val;
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
				let loadingInstance = Loading.service(this.loadingOptions);
				http.download(
					'generateCode',
					{
						'schemaId': this.$store.state.schema.schemaData.id,
						'generateList': this.form.generateList,
					},
					'code.zip'
				).then(()=>{
					loadingInstance.close();
				});
			}
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
		}
	}
}
</script>
