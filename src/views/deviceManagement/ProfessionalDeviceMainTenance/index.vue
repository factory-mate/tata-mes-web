<template>
    <div >
        <!-- <router-view/> -->
        <router-view  v-slot="{ Component }">
            <keep-alive>
            <component :is="Component" ></component>
            </keep-alive>
        </router-view>
    </div>
</template>