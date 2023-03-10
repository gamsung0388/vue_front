import Vue from 'vue';
import { createWebHistory, createRouter } from "vue-router";
import insertboard from "../views/insertboard.vue";
import selectList from "../views/selectList.vue";
import detailboard from "../views/detailboard.vue"
import updateboard from "../views/updateboard.vue"
import managerPage from "../views/managerPage.vue"
import manageComent from "../views/manageComent.vue"
import detailcomment from "../views/detailcomment.vue"
import login from "../views/login.vue"
import memberjoin from "../views/memberJoin.vue"

const routes = [
    {
        path: "/",
        name : "selectList",
        component : selectList,
    },
    {
        path: "/insert",
        name: "insertboard",
        component : insertboard,
    },
    {
        path: "/detail",
        name: "detail",
        component : detailboard,
        props: true
    },
    {
        path: "/update",
        name: "update",
        component : updateboard,
        props: true,
        
    },
    {
        path: "/manage",
        name: "managerPage",
        component : managerPage,
        props: true,
    },
    {
        path: "/manageC",
        name: "mangegerPage2",
        component : manageComent, 
        props:true
    },
    {
        path: "/detailcomment",
        name: "detailcomment",
        component : detailcomment,
        props: true
    },
    {
        path: "/login",
        name: "login",
        component :login,
        props : true
        
    },
    {
        path: "/memberjoin",
        name: "memberjoin",
        component :memberjoin,
        props : true
    },

];

const router = createRouter({
    history : createWebHistory(),
    routes,
});

export default router