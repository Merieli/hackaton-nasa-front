<script setup lang="ts">
import IconHamburguer from '@/components/IconHamburguer.vue';
import NavigationList from '@/components/NavigationList.vue';

// const props = defineProps({});
</script>

<template>
    <main class="drawer h-[100vh] overflow-hidden">
        <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content flex flex-col w-full">
            <!-- Navbar -->
            <header class="w-full navbar bg-meri-light">
                <div class="flex-none lg:hidden">
                    <label
                        for="my-drawer-3"
                        aria-label="open sidebar"
                        class="btn btn-square btn-ghost"
                    >
                        <IconHamburguer />
                    </label>
                </div>
                <div class="flex-1 px-2 mx-2">
                    <router-link to="/home">
                        <h1 class="">Ta quente aqui</h1>
                    </router-link>
                </div>
                <div class="flex-none hidden lg:block">
                    <NavigationList :isMobile="false" />
                </div>
            </header>
            <slot />
        </div>
        <div class="drawer-side">
            <label
                for="my-drawer-3"
                aria-label="close sidebar"
                class="drawer-overlay"
            ></label>
            <NavigationList :isMobile="true" />
        </div>
    </main>
</template>

<style lang="postcss" scoped></style>
