<script setup lang="ts">
const props = defineProps({
    title: String,
    message: String,
});
</script>

<template>
    <dialog id="send_fire_info" class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg">{{ title }}</h3>
            <p class="py-4">{{ message }}</p>
            <div class="modal-action">
                <form method="dialog">
                    <button class="btn">Close</button>
                </form>
            </div>
        </div>
    </dialog>
</template>

<style lang="postcss" scoped></style>
