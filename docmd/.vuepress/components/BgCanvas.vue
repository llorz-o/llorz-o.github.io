<template>
    <div class="canvas-container">
        <canvas id="star"></canvas>
        <canvas id="three"></canvas>
    </div>
</template>

<script>

import Three from '../public/vendor/tree.canvas';
import star from '../public/vendor/star';
export default {
    data:() => ({

    }),
    methods:{
    },
    created(){

    },
    mounted(){
        Three('three')
        star();
    },
    updated(){

    },
    destroyed(){

    }
}
</script>

<style lang="css">
.canvas-container{
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}
#three{
    position: absolute;
    top: 0;
    left: 45%;
    right: -45%;
    bottom: 0;
    /* z-index: -1; */
}
</style>


