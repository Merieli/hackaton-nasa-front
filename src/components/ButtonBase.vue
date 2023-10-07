<script setup lang="ts">
const props = defineProps({
    label: String,
});
</script>

<template>
    <button class="btn btn-neutral btn-block" type="submit">{{ label }}</button>
</template>

<style lang="postcss" scoped></style>
