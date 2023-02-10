import { createWebHistory, createRouter } from "vue-router";
import insertboard from "../views/insertboard.vue";
import selectList from "../views/selectList.vue";
import detailboard from "../views/detailboard.vue"

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
    }
];

const router = createRouter({
    history : createWebHistory(),
    routes,
});

export default router