<template>
    {{  state }}
    <div v-if="state.hasDropDown === true">
        Dropdown heading
    </div>
    <div v-if="state.status === State.Delimited"><Delimiter /></div>
    <div v-if="state.canFormat"><Formatter /></div>
    <div v-if="state.status === State.Static">Static</div>

    <select v-model="state.status" v-on:change="changeHeader" class="select select-bordered w-30">
        <option v-for="(key, state) in State" :value="key">{{ state }}</option>
    </select>
</template>

<script setup lang="ts">
import { ref } from "vue";

enum State {
    Simple = "simple",
    Delimited = "delimited",
    Static = "static"
}

const useDelimited = () => ({
    canFormat: true,
    hasDropDown: true,
    status: State.Delimited
})

const useStatic = () => ({
    canFormat: false,
    status: State.Static
})

const useSimple = () => ({
    canFormat: true,
    hasDropDown: true,
    status: State.Simple
})

let state = ref(useSimple())

const changeHeader = (event) => {
    switch (event.target.value) {
        case State.Simple as string: state.value = useSimple(); break;
        case State.Static as string: state.value = useStatic(); break;
        case State.Delimited as string: state.value = useDelimited(); break;
    }
}

</script>