<template>
    <div >
        <!-- <router-view/> 库房管理-->
        <router-view  v-slot="{ Component }">
            <keep-alive>
            <component :is="Component" ></component>
            </keep-alive>
        </router-view>
    </div>
</template>