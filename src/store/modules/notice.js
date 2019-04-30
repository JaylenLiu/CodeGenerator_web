const notice = {
	state: {
        msgNum :0
	},
	actions: {
		changeNum({commit}, info){
			commit('CHANGENUM', info);
		},
	},
	mutations: {
		CHANGENUM(state, info){
            state.msgNum = info;
		},
	}
};

export default notice;
