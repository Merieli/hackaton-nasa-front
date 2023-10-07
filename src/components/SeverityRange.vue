<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
    label: String,
});

const emit = defineEmits(['value']);

const rangeValue = ref(0);

const defineSeverityByRange = (range: number) => {
    if (range < 25) {
        emit('value', 'Very Low');
        return;
    }
    if (range < 50) {
        emit('value', 'Low');
        return;
    }
    if (range < 75) {
        emit('value', 'Average');
        return;
    }
    if (range < 80) {
        emit('value', 'High');
        return;
    }
    if (range >= 80) {
        emit('value', 'Very High');
        return;
    }
};
</script>

<template>
    <span class="label-text pb-3 pt-2">{{ label }}</span>
    <input
        v-model="rangeValue"
        type="range"
        min="0"
        max="100"
        class="range range-xs range-error"
        step="25"
        @input="defineSeverityByRange(rangeValue)"
    />
    <div class="w-full flex justify-between text-xs px-2 pt-2">
        <span>Very low</span>
        <span>Low</span>
        <span>Average</span>
        <span>High</span>
        <span>Very High</span>
    </div>
</template>

<style lang="postcss" scoped></style>
