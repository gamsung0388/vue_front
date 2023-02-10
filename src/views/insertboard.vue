<template>
    <div id="app">
      <div class="container">
        <input type="hidden" v-model="board.userId">  
        <div>
          <p>제목</p>
          <input type="text" class="form-control" v-model="board.boardTitle"/>
        </div>
        <div>
          <p>내용</p>
          <textarea v-model="board.boardTxt" rows="10"></textarea>
        </div>
        <div>
          <button @click="save">저장</button> 
          <button @click="$router.back()">취소</button>
        </div>
      </div>

    </div>
  </template>
  
  <script>

  import axios from 'axios'

  export default {
    name: 'insertboard',
    data () {
      return {
          board: {
            boardTitle: '',
            boardTxt: '',
            userId: 'ryan9320',

          }
      }    
    },
    methods : {
      save : function() {

        //console.log(this.board);
        
        this.axios.post('/board/insert', this.board)
        .then(()=>{
          this.$router.push('/')
        })
        .catch((ex)=>{
          console.error("failed write aricle",ex)
        })
        
      }
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  
  </style>
  