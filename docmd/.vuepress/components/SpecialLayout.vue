<template>
  <div class="custom-container">
      <a class="luna" href="https://llorz-o.github.io"></a>
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
  width: 80px;
  height: 80px;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255,255,255,.5333);
}
</style>

