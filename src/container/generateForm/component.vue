<template>
	<div>
		<el-row :gutter="32">
			<el-col :span="6">
				<!-- 左侧树 -->
				<el-tree
					:data="entityTreeData"
					accordion
					highlight-current
					@node-click="handleNodeClick">
				</el-tree>
			</el-col>
			<el-col :span="18">
				<!-- 中间表单 -->
				<el-form ref="componentForm" :model="form" :rules="rules" label-width="120px">
					<el-form-item label="标签名称" prop="label">
						<el-input v-model="form.label"></el-input>
					</el-form-item>
					<el-form-item label="默认值" prop="defaultValue">
						<el-input v-model="form.defaultValue" placeholder="组件默认值(初始值)"></el-input>
					</el-form-item>
					<el-form-item label="placeholder" prop="placeholder">
						<el-input v-model="form.placeholder"></el-input>
					</el-form-item>
					<el-form-item label="是否可见" prop="isVisibled">
						<el-switch v-model="form.isVisibled"></el-switch>
					</el-form-item>
					<el-form-item label="是否禁用" prop="isDisabled">
						<el-switch v-model="form.isDisabled"></el-switch>
					</el-form-item>
					<el-form-item label="是否必填" prop="isRequired">
						<el-switch v-model="form.isRequired"></el-switch>
					</el-form-item>
					<el-form-item label="是否查询条件" prop="isQuery">
						<el-switch v-model="form.isQuery"></el-switch>
					</el-form-item>
					<el-form-item label="组件类型" prop="componentType">
						<el-select v-model="form.componentType" placeholder="请选择组件类型">
							<el-option label="输入框" value="input"></el-option>
							<!-- <el-option label="单选框" value="radio"></el-option> -->
							<!-- <el-option label="多选框" value="checkbox"></el-option> -->
							<!-- <el-option label="下拉框" value="select"></el-option> -->
							<el-option label="开关按钮" value="switch"></el-option>
							<el-option label="日期选择器" value="datePicker"></el-option>
							<el-option label="时间选择器" value="dateTimePicker"></el-option>
						</el-select>
					</el-form-item>
					<!-- <el-form-item label="字典引用" prop="keynameId" v-show="form.componentType === 'radio' || form.componentType === 'checkbox' || form.componentType === 'select'">
						<el-select v-model="form.keynameId" placeholder="请选择组件类型">
							<el-option
								v-for="item in keynameOptions"
								:key="item.id" 
								:label="item.keyname"
								:value="item.id">
							</el-option>
						</el-select>
					</el-form-item> -->
				</el-form>
			</el-col>
		</el-row>
		<el-row type="flex" justify="center">
			<el-button type="primary"  @click="submitForm('componentForm')">保存</el-button>
		</el-row>
	</div>
</template>
<script type="text/javascript">
import http from '@util/http';
export default {
	data() {
	  return {
		keynameOptions:[],
		entityTreeData:[],
	    form: {
	    	label: '',
	    	defaultValue: '',
	    	placeholder: '',
	    	isVisibled: '',
	    	isDisabled: '',
	    	isRequired: '',
	    	isQuery: '',
	    	componentType: '',
	    	// keynameId: '',
	    },
	    rules: {
			label: [
				{ required: true, message: '请输入组件名称', trigger: 'blur' }
			],
			componentType: [
				{ required: true, message: '请输入表单布局', trigger: 'change' }
			],
		},
	  };
	},
	created() {
	},

	computed: {
		tableNames(){
			return this.$store.state.entity.tableNames;
		}
	},
	watch: {
		tableNames(newval,oldval){
			this.getEntityTree();
			this.getKeyOptions();
		},
	},
	methods: {
		handleNodeClick(data) {
			if (data.nodeType === 'field') {
				http.get('agileComponentByName', 
					{
						entityId: data.entityId,
						fieldName: data.label
					}).then((result)=>{
					if (result.httpCode === 200) {
						this.form = result.data;
					} else {
						this.$message({
							type: 'error',
							message: result.message
						});   
					}
				});
			}

		},
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					http.put('agileComponent', this.form).then((result)=>{
						if (result.httpCode === 200) {
							this.$message({
								type: 'success',
								message: '保存成功！'
							}); 
							// this.$emit('step');
						} else {
							this.$message({
								type: 'error',
								message: result.message
							});   
						}
					});
				}
			});
		},
		// 获取实体树
		getEntityTree(schemaId){
			http.get('entityTree', {schemaId: this.$store.state.schema.schemaData.id}).then((result)=>{
				if (result.httpCode === 200) {
					this.entityTreeData = result.data;
				} else {
					this.$message({
						type: 'error',
						message: result.message
					});   
				}
			});
		},
		// 获取字典信息
		getKeyOptions(){
			http.get('keynames', {}).then((result)=>{
				if (result.httpCode === 200) {
					this.keynameOptions = result.data;
				} else {
					this.$message({
						type: 'error',
						message: result.message
					});   
				}
			});
		},
	}
};
</script>
<style type="text/css" scoped>

</style>
