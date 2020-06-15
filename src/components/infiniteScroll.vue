<template>
  <div class="box">
    <ul v-infinite-scroll="load" 
        infinite-scroll-immediate="immediate"
        infinite-scroll-delay="delay"
        infinite-scroll-disabled="disabled"
        infinite-scroll-distance="distance">
      <li v-for="item in count" :key="item">{{item}}</li>
    </ul>
  </div>
</template>
<script>
export default {
  data(){
    return {
      immediate: true,
      delay: 20,
      distance: 0,
      disabled: false,
      count: 5,
    }
  },
  methods: {
    load(){
      this.count += 5
    },
  },
}
</script>
<style scoped>
.box{
  width: 200px;
  height:300px;
  overflow: hidden;
  border:2px solid #f60;
}
  ul{
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }
  li{
      list-style: none;
      margin-bottom: 8px;
      display: block;
      padding: 6px 12px;
      background-color: aliceblue;
      color: #303133;
    }
</style>