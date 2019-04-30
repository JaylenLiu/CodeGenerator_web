import Vue from 'vue';
import Vuex from 'vuex';
import schema from './modules/schema';
import databaseCon from './modules/databaseCon';
import key from './modules/key';
import entity from './modules/entity';
import notice from './modules/notice';
Vue.use(Vuex);

const store = new Vuex.Store({
	modules: {
		schema,
		databaseCon,
		key,
		entity,
		notice
	},
});

export default store;