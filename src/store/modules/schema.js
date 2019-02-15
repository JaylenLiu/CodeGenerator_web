const schema = {
	state: {
		schemaData:{}
	},
	actions: {
		saveSchema({commit}, info){
			commit('SAVE_SCHEMA',info);
		}
	},
	mutations: {
		SAVE_SCHEMA(state, info){
			state.schemaData = info;
		}
	}
};

export default schema;
