<template>
    <div >
        <!-- <router-view/> 车间报表-->
        <router-view  v-slot="{ Component }">
            <keep-alive>
            <component :is="Component" ></component>
            </keep-alive>
        </router-view>
    </div>
</template>