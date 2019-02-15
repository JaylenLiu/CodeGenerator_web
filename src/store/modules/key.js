const key = {
	state: {
		keynameId:"",
		keyvalues:[],
		keyPages:1,
	},
	actions: {
		saveKeyvalues({commit}, info){
			commit('SAVE_KEYVALUES', info);
		},
		saveKeynameId({commit}, info){
			commit("SAVE_KEYNAMEID", info);
		},
		saveKeyPages({commit}, info){
			commit("SAVE_KEYPAGES", info);
		},
	},
	mutations: {
		SAVE_KEYVALUES(state, info){
            state.keyvalues = info;
		},
		SAVE_KEYNAMEID(state, info){
			state.keynameId = info;
		},
		SAVE_KEYPAGES(state, info){
			state.keyPages = info;
		}
	}
};

export default key;
