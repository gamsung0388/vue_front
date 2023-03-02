<template>
  <div class="selectList">
      <div v-if="selected==false">
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
            <tr v-for="(vitem, idx) in list" :key="idx">
              <th>
                <input 
                  type="checkbox" 
                  :id="vitem.boardNum"
                  name="chk"
                  :value="vitem.boardNum"
                  v-model="selectList" 
                  :key="idx">
              </th>
              <td align="center"> {{ vitem.boardNum }}</td>
              <!-- <td align="center"><router-link to="{ name='/detail', params: { name:'test', boardNum: 'boardnum'} }">{{vitem.boardTitle}}</router-link></td> -->
              <td align="center"><button @click="showInfo(idx)">{{vitem.boardTitle}}</button></td>
              <td>{{vitem.userId}}</td>
              <td align="center">{{vitem.boardViewcnt}}</td>          
              <td>{{vitem.boardDateFormatted}}</td>
              <td>{{vitem.boardUdtFormatted}}</td>
            </tr>
          </tbody>
        </table>
        <div>
          <div>
            <span>
              <img src="@/assets/img/twoleft.png" @click="pageGo(1)" style="width:12px">
              <img v-if="page.existPrevPage==true" @click="pageGo(page.startPage+1)" src="@/assets/img/left.png" style="width:12px">
            </span>
            <span class="pageform" id="pageform">
              <a href="javascript:void(0)" @click="pageGo(page)"  v-for="page in pageList" :key="page"> {{page}} </a>
            </span>               
            <span>
              <img v-if="page.existNextPage==true" @click="pageGo(page.endPage+1)" src="@/assets/img/right.png" style="width:12px">
              <img src="@/assets/img/tworight.png" @click="pageGo(page.totalPageCnt)" style="width:12px">
            </span>
          </div>
          <router-link to="/insert"><button>등록</button></router-link> 
          <button @click="boardTwoDelete()">삭제</button>
          <br>
          <router-link to="/manage"><button>관리자</button></router-link> 
        </div>
      </div>  
  </div>
</template>

<script>
import router from '@/router';
import axios from 'axios';
import selectData from './detailboard.vue'

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
            pageList : [],
            searchDTO : {
              page : 1,
              recordSize : 5,
              pageSize : 5
            },
            page : {
              page : "",
              totalPageCnt : "",
              totalRecordCnt : "",
              startPage : "",
              endPage : "",
              limitPage : "",
              existNextPage : "",
              existPrevPage : ""
            },
            item: null,
            selected: false
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
          this.searchDTO.page= 1;
          this.boardSelect();
        },
        pageGo(page){
          
          this.selected = false;
          this.selectList = [];

          this.searchDTO.page= page;
          //this.searchDTO.page = page; 
          this.boardSelect();
        },

        boardSelect(){

          //console.log(pageNum)    
          this.axios.get("/board/list",{
            params : {
              pageNum : this.searchDTO.page
            }
          })
          .then(res => {
            // console.log(res.data);
            this.list = res.data.boardList;
            this.page = res.data.pagination;

            // console.log(this.list);
            // console.log(this.page);

            //게시판 for
            res.data.boardList.forEach(i => {
              this.checkList.push(i.boardNum) 
            });
            
            //이전 페이징 삭제 함수
            var pageform = document.querySelector("#pageform");
            
            Array
              .prototype
              .slice.call(pageform.children)
              .forEach( function(child){
                console.log(child);
                pageform.removeChild(child)
              }
            )
            for(var j = this.page.startPage; j<this.page.endPage+1; j++){
              // console.log(j);
              this.pageList.push(j);
            }
          })
          .catch(err => {
              console.log(err);
          });
        },
        boardTwoDelete(){
          var params = {
            checkList : Object.values(this.selectList) 
          }
          if(this.selectList.length==0){
            alert("삭제할 데이터를 체크해주세요");
          }else{
            this.boardDelete(params)
          }
        },

        boardDelete(params){
          this.axios.get("/board/delete?checkList="+encodeURIComponent(JSON.stringify(params.checkList)))
          .then(res => {
            console.log(res.data);  
            this.boardSelect();
            if(this.selected==true){
              this.selected=false;              
            }
            this.selectList = [];
            
          })
          .catch((ex)=>{
            console.error("failed write aricle",ex);
          })
        },

        showInfo(idx){
          this.item =  this.list[idx]
          this.$router.push({path:'/detail',query: {boardNum: this.item.boardNum}})
        },
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
