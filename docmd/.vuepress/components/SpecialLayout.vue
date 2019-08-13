<template>
  <div class="custom-container">
      <bg-canvas>

      </bg-canvas>
  </div>
</template>

<script>
import BgCanvas from './BgCanvas';

export default {
  components:{
    'bg-canvas':BgCanvas,
  },
  data() {
    return {};
  },
  methods: {}
};
</script>


<style lang="css">
html,
body,
#app,
.custom-container {
  height: 100%;
  margin: 0;
  padding: 0;
}
.custom-container * {
  margin: 0;
  padding: 0;
}
</style>

