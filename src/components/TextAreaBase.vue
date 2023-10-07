<script setup lang="ts">
import { defineEmits, ref } from 'vue';

const props = defineProps({
    label: String,
    placeholder: String,
});
const emit = defineEmits(['value']);

const textValue = ref('');
</script>

<template>
    <div class="form-control pb-4">
        <label class="label">
            <span class="label-text">{{ label }}</span>
        </label>
        <textarea
            v-model="textValue"
            class="textarea textarea-bordered h-24"
            :placeholder="placeholder"
            maxlength="255"
            @input="$emit('value', textValue)"
        ></textarea>
    </div>
</template>

<style lang="postcss" scoped></style>
