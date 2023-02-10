<template>
  <div class="hello">
    <h1>{{ title }}</h1>
    <div>
      
    </div>  
    <div>
      <button @click="add">등록</button> 
      <button>삭제</button>
    </div>
    
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    //msg: String
  },
  data () {
    return {
      title : "게시물",

    }    
  },
  add () {
    return{
        
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
