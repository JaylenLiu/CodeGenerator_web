import Vue from 'vue';
import Vuex from 'vuex';
import schema from './modules/schema';
import databaseCon from './modules/databaseCon';
import key from './modules/key';
import entity from './modules/entity';
Vue.use(Vuex);

const store = new Vuex.Store({
	modules: {
		schema,
		databaseCon,
		key,
		entity
	},
});

export default store;