import { createStore } from "vuex";
import Vuex from 'vuex';


export const store = new Vuex.Store ({
    state : {
        counter : 2
    },
    getters : {
        getTwoPowerCounter(state){
            return state.counter ** 2;
        }
    },
    mutations : {
        setCounter(state,value){
            state.counter = value;
        }
    },
    actions : {

    }
})