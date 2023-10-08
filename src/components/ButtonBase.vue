<script setup lang="ts">
import { PropType } from 'vue';

type TypeButton = 'button' | 'submit' | 'reset';

const props = defineProps({
    label: String,
    typeButton: {
        type: String as PropType<TypeButton>,
        default: 'button',
    },
});
</script>

<template>
    <button class="btn btn-neutral btn-block" :type="typeButton">{{ label }}</button>
</template>

<style lang="postcss" scoped></style>
