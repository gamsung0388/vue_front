<template>
  <div class="selectList">
      <table border="1">
        <thead>
          <tr>
            <th><input type="checkbox" value="all" v-model="allChk"></th>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>조회수</th>          
            <th>등록날짜</th>
            <th>수정날짜</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in list" :key="idx" @click="showInfo(idx)">
            <th>
              <input 
                type="checkbox" 
                :id="item.boardNum" 
                :value="item.boardNum"
                v-model="selectList" 
                :key="idx">
            </th>
            <td align="center"> {{ item.boardNum }}</td>
            <td align="center"><router-link v-bind="item.boardNum" to="/detail?">{{item.boardTitle}}</router-link></td>
            <td>{{item.userId}}</td>
            <td align="center">{{item.boardViewcnt}}</td>          
            <td>{{item.boardDate}}</td>
            <td>{{item.board_udt}}</td>
          </tr>
        </tbody>
      </table>
      <div>
        <router-link to="/insert"><button>등록</button></router-link> 
        <router-link to="/"><button>삭제</button></router-link> 
      </div>
      
  </div>
</template>

<script>
import router from '@/router';
import axios from 'axios';

export default {
    name: "selectList",
    
    mounted() {
        this.load();
    },
    data() {
        return {
            list: [],
            selectList : [],
            checkList : [],
            item: null,
        };
    },
    computed:{
      allChk : {
        get () {
          return this.list.length == this.selectList.length;
        },
        set (e) {
          this.selectList = e ? this.checkList : [];
        }
      }
    },
    methods: {
        load() {
            this.axios.get("/board/list")
                .then(res => {
                console.log(res.data);
                this.list = res.data;
                res.data.forEach(i => {
                  this.checkList.push(i.boardNum) 
                });

            })
                .catch(err => {
                console.log(err);
            });
        },
        
        showInfo(idx){
          this.item =  this.list[idx]
          this.selected = true
        },
        closeInfo(){

        }
    },
    components: { router }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
