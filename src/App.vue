<template>
  <div>
    <h1><router-link to="/">게시물</router-link></h1>
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
