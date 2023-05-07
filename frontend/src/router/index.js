import { createWebHistory, createRouter } from "vue-router";
import { useAuthStore } from '@/stores/store';

function loadView(view) {
    return () => import(`@/views/${view}.vue`)
}

const routes = [
    {
        path: "/",
        children: [
            {
                path: '',
                name: "home",
                component: loadView('Home'),
                alias: ["/home"],
            },
            {
                path: "post/:id",
                name: "post.comments",
                component: loadView('PostComments'),
                props: true
            },
        ],
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/account",
        name: "account",
        component: loadView('Account'),
    },
    {
        path: "/friends",
        children: [
            {
                path: '',
                name: "friends",
                component: loadView('Friends'),
            },
            {
                path: "requests",
                name: "friends.requests",
                component: loadView('FriendRequest'),
            },
            {
                path: "list",
                name: "friends.list",
                component: loadView('FriendList'),
            },
            {
                path: "search=:search",
                name: "friends.search",
                component: loadView('FriendSearch'),
                props: true,
            }
        ],
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/profile/id=:id",
        name: 'user',
        children: [
            {
                path: "",
                name: "user.posts",
                component: loadView('UserPosts'),
                props: true,
            },
            {
                path: "about",
                name: "user.about",
                component: loadView('UserAbout'),
                props: true,
            },
            {
                path: "friends",
                name: "user.friends",
                component: loadView('UserFriends'),
                props: true,
            }
        ],
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/messages",
        name: "messages",
        component: loadView('Conversations'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/:pathMatch(.*)*",
        name: "notfound",
        component: loadView('NotFound'),
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        if (!authStore.login) {
            next({ name: 'account' })
        } else {
            next() // go to wherever I'm going
        }
    } else {
        next() // does not require auth, make sure to always call next()!
    }
})
export default router;
