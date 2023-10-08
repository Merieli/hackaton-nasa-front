<script setup lang="ts">
import { defineEmits, ref } from 'vue';

const props = defineProps({
    label: String,
    placeholder: String,
    error: String,
});

const emit = defineEmits(['value']);

const textValue = ref('');
const errorMessage = ref('');
const hasError = ref(false);

/**
 * Set the error message and show the error
 * @param message
 */
const alertError = (message: string) => {
    errorMessage.value = message;
    hasError.value = true;
};

const validInput = () => {
    hasError.value = false;

    if (textValue.value === '') {
        return alertError('Required field');
    }

    emit('value', textValue.value);
};
</script>

<template>
    <div class="form-control w-full max-w-xs pb-4">
        <label class="label">
            <span class="label-text">{{ label }} <b class="text-danger-light">*</b></span>
        </label>
        <input
            v-model="textValue"
            type="text"
            :placeholder="placeholder"
            maxlength="50"
            required
            class="input input-bordered w-full max-w-xs"
            :class="{
                'input-error': hasError,
            }"
            @input="validInput"
        />
        <label v-if="hasError" class="label">
            <span class="label-text-alt text-danger-light">{{ errorMessage }}</span>
        </label>
    </div>
</template>

<style lang="postcss" scoped></style>
