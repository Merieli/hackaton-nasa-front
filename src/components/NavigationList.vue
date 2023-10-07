<script setup lang="ts">
import IconAlert from '@/components/IconAlert.vue';
import { useMapStore } from '@/store/useMapStore';

const props = defineProps({
    isMobile: Boolean,
});

const store = useMapStore();

const { setCurrentLocation } = useMapStore();

const resetSidebar = () => {
    store.locationIsSelected = false;
};
</script>

<template>
    <ul
        :class="{
            'menu p-4 w-80 min-h-full bg-base-200': isMobile,
            'menu menu-horizontal': !isMobile,
        }"
    >
        <li>
            <router-link to="/home" @click="resetSidebar" @keydown.enter="resetSidebar">
                Fire ocurrences (Live)
            </router-link>
        </li>
        <li>
            <router-link to="/report" @click="resetSidebar" @keydown.enter="resetSidebar">
                <IconAlert />
                Report fire
            </router-link>
        </li>
        <li>
            <button
                id="set-location-button"
                type="button"
                ref="locationButton"
                @click="setCurrentLocation"
                @keydown.enter="setCurrentLocation"
            >
                Current Location
            </button>
        </li>
    </ul>
</template>

<style lang="postcss" scoped></style>
