import { createStore } from "vuex";
import rootActions from './actions.js';
import rootGetters from './getters.js';
import rootMutations from './mutations.js';

const store = createStore ({

    state () {
        return {
            base_url : 'http://localhost:8080',
            sessionId : sessionStorage.getItem('sessionId') || ''
        };
    },

    mutations : rootMutations,
    actions : rootActions,
    getters : rootGetters
})

export default store;