<template>
    <nav class="navbar navbar-expand-lg bg-white rounded-3 mb-1 card">
        <div class="container-fluid justify-content-center">
            <ul class="navbar-nav">
                <li class="nav-item mx-1">
                    <router-link class="nav-link btn btn-outline-light"
                        :class="[($route.name == 'user.posts') ? { active: true } : '']" :to="{
                            name: 'user.posts'
                        }">Post</router-link>
                </li>
                <li class="nav-item mx-1">
                    <router-link class="nav-link btn btn-outline-light"
                        :class="[($route.name == 'user.about') ? { active: true } : '']" :to="{
                            name: 'user.about'
                        }">About</router-link>

                </li>
                <li class="nav-item mx-1">
                    <router-link class="nav-link btn btn-outline-light"
                        :class="[($route.name == 'user.friends') ? { active: true } : '']" :to="{
                            name: 'user.friends'
                        }">Friends</router-link>
                </li>
            </ul>
        </div>
    </nav>
</template>
<script>
</script>
<style scoped>
.btn-outline-light {
    border: 0;
    color: rgba(0, 0, 0);
    font-weight: bold;
}

.btn-outline-light:hover {
    color: #007BFF;
}

.active {
    background: none;
    border-bottom: 3px solid #007BFF !important;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}
</style>