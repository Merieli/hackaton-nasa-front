<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue';
// const props = defineProps({});
</script>

<template>
    <DefaultLayout>
        <div class="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
            <div class="drawer-content flex flex-col items-center justify-center">
                <!-- Page content here -->
                <label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden">
                    Edit report
                </label>

                <slot name="content" />
            </div>
            <div class="drawer-side h-[calc(100vh_-_68px)]">
                <label
                    for="my-drawer-2"
                    aria-label="close sidebar"
                    class="drawer-overlay"
                ></label>
                <slot name="sidebar" />
            </div>
        </div>
    </DefaultLayout>
</template>

<style lang="postcss" scoped></style>
