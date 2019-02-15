const entity = {
	state: {
        conId:'',
        databaseName:'',
        tableNames:[]
	},
	actions: {
		saveConId({commit}, info){
			commit('SAVE_CONID',info);
        },
        saveDatabaseName({commit}, info){
			commit('SAVE_DATABASENAME',info);
        },
        saveTableNames({commit}, info){
			commit('SAVE_TABLENAMES',info);
		}
	},
	mutations: {
		SAVE_CONID(state, info){
			state.conId = info;
        },
        SAVE_DATABASENAME(state, info){
			state.databaseName = info;
        },
        SAVE_TABLENAMES(state, info){
			state.tableNames = info;
		},
	}
};

export default entity;
