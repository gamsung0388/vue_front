<template>
  <div>
    <div>
      <router-link to="/">게시판</router-link>
      <router-link to="/login">로그인</router-link>
    </div>
    <nav>
    </nav>
    <router-view />  
    
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>

</style>
