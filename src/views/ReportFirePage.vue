<script setup lang="ts">
import ButtonBase from '@/components/ButtonBase.vue';
import InputBase from '@/components/InputBase.vue';
import MapWithFireBase from '@/components/MapWithFireBase.vue';
import SeverityRange from '@/components/SeverityRange.vue';
import TextAreaBase from '@/components/TextAreaBase.vue';
import EditionLayout from '@/layouts/EditionLayout.vue';
import { useMapStore } from '@/store/useMapStore';
import { ref } from 'vue';
// const props = defineProps({});

const store = useMapStore();

const reportBy = ref('');
const risk = ref('');
const fireSeverity = ref('');

const updateReportBy = (value: string) => {
    reportBy.value = value;
};

const updateRisk = (value: string) => {
    risk.value = value;
};

const updateSeverity = (value: string) => {
    fireSeverity.value = value;
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
                        class="mt-auto"
                        label="Teste < add mark"
                        @click.prevent="store.createNewMarkerWithInfo"
                    ></ButtonBase>

                    <ButtonBase
                        id="button-save-register"
                        class="mt-auto"
                        label="Save"
                        @click.prevent="
                            store.saveDataOfRegisterFire({
                                reportBy,
                                riskInNeighbourhood: risk,
                                fireSeverity,
                            })
                        "
                    ></ButtonBase>
                </form>
            </ul>
        </template>
        <template #content>
            <h4 v-if="!store.locationIsSelected" class="text-2xl font-bold pt-4">
                Locate and mark the location of the fire on the map
            </h4>
            <MapWithFireBase></MapWithFireBase>
        </template>
    </EditionLayout>
</template>

<style lang="postcss" scoped></style>
