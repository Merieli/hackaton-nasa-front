<script setup lang="ts">
import ButtonBase from '@/components/ButtonBase.vue';
import IconEdit from '@/components/IconEdit.vue';
import InputBase from '@/components/InputBase.vue';
import MapWithFireBase from '@/components/MapWithFireBase.vue';
import SeverityRange from '@/components/SeverityRange.vue';
import TextAreaBase from '@/components/TextAreaBase.vue';
import EditionLayout from '@/layouts/EditionLayout.vue';
import { useMapStore } from '@/store/useMapStore';
import { ref } from 'vue';

const store = useMapStore();

const reportBy = ref('');
const risk = ref('');
const fireSeverity = ref('');
const errorMessageInInput = ref('');

const updateReportBy = (value: string) => {
    reportBy.value = value;
};

const updateRisk = (value: string) => {
    risk.value = value;
};

const updateSeverity = (value: string) => {
    fireSeverity.value = value;
};

const saveDataAndValidRequiredFields = () => {
    if (!reportBy.value) {
        errorMessageInInput.value = 'Required field';

        return;
    }

    store.saveDataOfRegisterFire({
        reportBy: reportBy.value,
        riskInNeighbourhood: risk.value,
        fireSeverity: fireSeverity.value || 'Very low',
    });
};
</script>

<template>
    <EditionLayout>
        <template #sidebar>
            <ul
                v-if="store.locationIsSelected"
                class="menu p-8 w-96 h-full bg-base-200 text-base-content"
            >
                <form class="flex flex-col flex-grow">
                    <h3 class="text-2xl font-bold pb-8">Occurrence details</h3>
                    <InputBase
                        label="Report by"
                        placeholder="Your name"
                        :error-message="errorMessageInInput"
                        @value="updateReportBy"
                    />
                    <TextAreaBase
                        label="Risk in the neighborhood"
                        placeholder=""
                        @value="updateRisk"
                    />
                    <SeverityRange label="Fire severity:" @value="updateSeverity" />
                    <ButtonBase
                        id="button-save-register"
                        class="mt-auto bg-meri-light border-meri-light hover:opacity-75 hover:bg-meri-light hover:border-meri-light"
                        label="Save"
                        @click="saveDataAndValidRequiredFields"
                        @keydown.enter="saveDataAndValidRequiredFields"
                    ></ButtonBase>
                </form>
            </ul>
        </template>
        <template #content>
            <label
                v-if="store.locationIsSelected"
                for="my-drawer-2"
                class="btn btn-neutral drawer-button lg:hidden my-2"
            >
                <IconEdit />
            </label>

            <h4 v-if="!store.locationIsSelected" class="text-2xl font-bold pt-4">
                Locate and mark the location of the fire on the map
            </h4>
            <MapWithFireBase></MapWithFireBase>
        </template>
    </EditionLayout>
</template>

<style lang="postcss" scoped></style>
