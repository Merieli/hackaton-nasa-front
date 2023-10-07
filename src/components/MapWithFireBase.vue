<script setup lang="ts">
import { useMapStore } from '@/store/useMapStore';
import { onMounted } from 'vue';

const store = useMapStore();

onMounted(async () => {
    const divMap = document.getElementById('map') as HTMLElement;
    store.startMap(divMap);
});
</script>

<template>
    <div
        class="artboard artboard-horizontal rounded-2xl w-[calc(100%_-_5rem)] h-[calc(100vh_-_68px_-_5rem)] m-auto drop-shadow-lg roudend overflow-hidden"
    >
        <div id="map"></div>
    </div>
</template>

<style lang="postcss" scoped>
html,
body,
#map {
    height: 100%;
    margin: 0;
    padding: 0;
}
</style>
