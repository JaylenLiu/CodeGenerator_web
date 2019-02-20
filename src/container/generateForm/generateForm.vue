<template>
	<div>
		<!-- 头顶上的步骤 -->
		<el-steps :active="step" align-center>
			<el-step title="方案"></el-step>
			<el-step title="实体"></el-step>
			<el-step title="组件"></el-step>
			<el-step title="代码生成"></el-step>
		</el-steps>
		<!-- 中间的步骤体 -->
		<div class="container">
			<Schema v-show="step === 0" class="step_son" ref="schema" @step="toNext"></Schema>
			<Entity v-show="step === 1" class="step_son" ref="entity" @step="toNext"></Entity>
			<Components v-show="step === 2" ref="component" @step="toNext"></Components>
			<GenerateCode v-show="step === 3" class="step_son" ref="generate"></GenerateCode>
		</div>
		<!-- 控制按钮 -->
		<div class="btn_group right">
			<el-button
				class="base_btn"
				@click="toLast"
				v-show="step !== 0">
				上一步
			</el-button>
			<el-button
				type="primary"
				class="base_btn"
				@click="toNext"
				v-show="step !== 3">
				下一步
			</el-button>
		</div>
	</div>
</template>

<script type="text/javascript">

import Schema from './schema.vue';
import Entity from './entity.vue';
import Components from './component.vue';
import GenerateCode from './generateCode.vue';

export default {
	components: {
		Schema,
		Entity,
		Components,
		GenerateCode
	},
	data() {
		return {
			step: 0
		};
	},
	methods: {
		toNext() {
			this.step += 1;
		},
		toLast() {
			if (this.step !== 0) {
				this.step -= 1;
			}
		}
	}
}
</script>

<style type="text/css" scoped>
	.btn_group{
		margin-top: 10px;
	}
	.right{
		float: right;
	}
	.step_son{
		width: 60%;
		margin: 0 auto;
		padding: 30px 0;
	}
</style>
