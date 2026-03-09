<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import type {
    AvailableLanguage,
    BooleanString,
    InputPosition,
    Loading,
    Mapping,
    Repo,
    Theme,
} from '~/types/giscus';

defineProps<{
    id?: string;
    host?: string;
    repo: Repo;
    repoId: string;
    category?: string;
    categoryId?: string;
    mapping: Mapping;
    term?: string;
    theme?: Theme;
    strict?: BooleanString;
    reactionsEnabled?: BooleanString;
    emitMetadata?: BooleanString;
    inputPosition?: InputPosition;
    lang?: AvailableLanguage;
    loading?: Loading;
}>();

const mounted = ref(false);

onMounted(() => {
    import('giscus').then(() => (mounted.value = true));
});
</script>

<template>
    <div class="giscus-wrapper">
        <giscus-widget v-if="mounted" :id="id" :host="host" :repo="repo" :repoid="repoId" :category="category"
            :categoryid="categoryId" :mapping="mapping" :term="term" :strict="strict"
            :reactionsenabled="reactionsEnabled" :emitmetadata="emitMetadata" :inputposition="inputPosition"
            :theme="theme" :lang="lang" :loading="loading" />
    </div>
</template>

<style scoped>
.giscus-wrapper {
    width: 100%;
    margin-top: 1rem;
}

.giscus-wrapper :deep(.giscus) {
    width: 100%;
}

.giscus-wrapper :deep(.giscus-frame) {
    border: none;
    width: 100%;
    color-scheme: normal;
}
</style>
