import Vue from 'vue';
import { createWebHistory, createRouter } from "vue-router";
import insertboard from "../views/insertboard.vue";
import selectList from "../views/selectList.vue";
import detailboard from "../views/detailboard.vue"
import updateboard from "../views/updateboard.vue"

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
        
    }
];

const router = createRouter({
    history : createWebHistory(),
    routes,
});

export default router