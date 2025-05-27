import { createStore } from "vuex";
import rootActions from './actions.js';
import rootGetters from './getters.js';
import rootMutations from './mutations.js';
import usermodule from "./modules/user/index.js";


const store = createStore ({

    modules:{
        user: usermodule,
    },

    state () {
        return {
            base_url :"http://localhost:8080",
            sessionId : sessionStorage.getItem('sessionId') || ''
        };
    },

    mutations : rootMutations,
    actions : rootActions,
    getters : rootGetters
})

export default store;