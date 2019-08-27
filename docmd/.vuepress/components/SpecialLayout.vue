<template>
  <div class="custom-container">
      <a class="luna" href="https://llorz-o.github.io">
        <span class="hole"></span>
        <span class="hole"></span>
        <span class="hole"></span>
        <span class="hole"></span>
        <span class="hole"></span>
      </a>
      <bg-canvas class="bg-temp"/>
      <main-panel/>
  </div>
</template>

<script>
import BgCanvas from './BgCanvas';
import MainPanel from './MainPanel'

export default {
  components:{
    'bg-canvas':BgCanvas,
    'main-panel':MainPanel
  },
  data() {
    return {};
  },
  methods: {}
};
</script>


<style lang="css">
.custom-container {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.custom-container * {
  margin: 0;
  padding: 0;
}
.bg-temp{
  position: absolute;
  z-index: -1;
}
.luna{
  width: 80px;
  height: 80px;
  position: absolute;
  border-radius: 50%;
  box-shadow: inset 13px 0 10px  rgba(255,255,255,.8);
  border-left: 1px solid rgba(255, 255, 255, 0.3333);
  transform: rotateZ(-45deg);
  top: 56px;
  left: 99px;
  text-decoration: none;
  background-color: #000;
}
.luna::before{
  content: '';
  display: block;
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255,255,255,.5333);
}
.luna .hole{
  display: block;
  border-radius: 50%;
  width: 10px;
  height: 10px;
  box-shadow: inset
  -2px 0 2px rgba(255, 255, 255, .6333),
  2px 0 2px rgba(0, 0, 0, .666);
  position: relative;
}
.hole::after{
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  box-shadow: inset
  2px 0 2px rgba(0, 0, 0, .211),
  -2px 0 1px rgba(255, 255, 255, .4333);
}

.hole:nth-child(1){
  left: 5%;
  top: 50%;
}
.hole:nth-child(2){
  width: 4px;
  height: 4px;
  top: 30%;
  left: 12.55%;
}
.hole:nth-child(3){
  width: 6px;
  height: 6px;
  top: 45%;
  left: 4.55%;
}
.hole:nth-child(4){
  width: 6px;
  height: 6px;
  top: 56%;
  left: 20.55%;
}
.hole:nth-child(5){
  width: 9px;
  height: 9px;
  top: 0;
  left: 12.55%;
}
</style>

