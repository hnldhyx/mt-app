<template>
  <el-container class="layout-default">
    <el-header height="220px">
      <myHeader></myHeader>
    </el-header>
    <el-main>
      <nuxt/>
    </el-main>
    <el-footer height="100%">
      <myFooter></myFooter>
    </el-footer>
  </el-container>
</template>

<script> 
import myHeader from '@/components/public/header/index.vue';
import myFooter from '@/components/public/footer/index.vue';
export default {
  components:{
    myHeader,
    myFooter,
  }
}
</script>

<style lang="scss" scoped>
.el-header{
  background: #fff;
  box-shadow: 0 2px 27px 0 rgba(0,0,0,0.10);
}

.el-main{
  padding-top: 0;
}
</style>