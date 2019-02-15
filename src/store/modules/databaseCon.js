const databaseCon = {
	state: {
		fieldData:[],
		conData:{},
	},
	actions: {
		saveFileds({commit}, info){
			commit('SAVE_FIELDS',info);
		},
		saveConData({commit}, info){
			commit('SAVE_CONDATA',info);
		}
	},
	mutations: {
		SAVE_FIELDS(state, info){
			state.fieldData = info;
		},
		SAVE_CONDATA(state, info){
			state.conData = info;
		}
	}
};

export default databaseCon;
