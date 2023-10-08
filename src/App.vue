<script setup lang="ts">
import ModalBase from './components/ModalBase.vue';
</script>

<template>
    <router-view />
    <ModalBase
        title="Report Saved!"
        message="We communicated to the authorities in the region to combat the fire."
    />
</template>

<style lang="postcss" scoped></style>
