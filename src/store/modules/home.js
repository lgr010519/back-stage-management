import mockRequest from '@/utils/mockRequest'

const state = {
    list: {}
}

const actions = {
    async getData({
        commit
    }) {
        let result = await mockRequest.get('/home/list')
        if (result.code == 20000) {
            commit('GETDATA', result.data)
        }
    }
}

const mutations = {
    GETDATA(state, list) {
        state.list = list
    }
}

const getters = {

}

export default {
    state,
    actions,
    mutations,
    getters
}