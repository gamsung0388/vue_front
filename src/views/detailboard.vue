<template>
    <div>
      <table border="1">
        <tr>
          <th>제목</th>
          <td>{{board.boardTitle}}({{board.userId}})</td>
        </tr>
        <tr>
          <th>내용</th>
          <td>{{board.boardTxt}}</td>
        </tr>
        <tr>
          <th>태그</th>
          <td>{{board.boardTag}}</td>
        </tr>
        <tr>
            <td v-for="img in images" :key="img">
                <img :src="img" width="100" />
            </td>              
        </tr> 
        <tr v-for="fileData,idx in fileList" :key="idx" >
          <td colspan="2">
              <a href="javascript:void(0);" @click="filedown(fileData.fileId)">{{fileData.name}}</a>
          </td>      
        </tr>
        <tr>
          <th>등록일</th>
          <td>{{board.boardDateFormatted}}</td>
        </tr>
        <tr>
          <th>수정일</th>
          <td>{{board.boardUdtFormatted}}</td>
        </tr>
        
      </table>
      <button @click="boardUpdate">수정</button>
      <button @click="boardOneDelete(board.boardNum)">삭제</button>
      <button @click="$router.back();">목록</button>

      <div>
        <div>댓글</div>
        <div>
            <input type="text" v-model="comment.commentTxt">
            <button @click="cmAdd">등록</button>  
        </div> 
        <div>
            <div v-for="(commentData,idx) in commentList" :key='idx'>
                <p>{{ commentData.userId}} 
                  <button v-if="updateComment.commentNum != commentData.commentNum" @click="() => cmUpdateform(commentData.commentNum,commentData.commentTxt)">수정</button>
                  <button v-if="updateComment.commentNum != commentData.commentNum" @click="() => cmDelete(commentData.commentNum)">삭제</button>
                  <button v-if="updateComment.commentNum==commentData.commentNum && commentUpdate==true" @click=" () => cmUpdate(commentData.commentNum)">저장</button>
                  <button v-if="updateComment.commentNum==commentData.commentNum && commentUpdate==true" @click=" () => cmCancle">취소</button>

                </p>              
                <div v-if="updateComment.commentNum != commentData.commentNum">
                  {{ commentData.commentTxt }}
                </div>      
                
                <div v-if="updateComment.commentNum==commentData.commentNum&& commentUpdate==true">
                  <textarea name="" id="" cols="30" rows="5" v-model="updateComment.commentTxt">  
                  </textarea>
                </div>
            </div>
        </div>
      </div>  
    </div>
      
</template>
<script>
import axios from 'axios';
import detailcomment from "./detailcomment.vue"

export default {
    name : "detailboard",
    components: {
      detailcomment
    },
    created(){
        //console.log(this.router.query.boardNum)
    },
    mounted(){
        this.load();
    },
    data(){
        return {
            commentUpdate : false,
            board:{
                boardNum : "",
                boardTitle : "",
                boardTxt : "",
                boardTag : "",
                userId : "",
                udateUserId : "",
                boardViewcnt : "",
                boardDate : "",
                board_udt : "",
                fileIdxs : []
            },
            comment:{
                commentNum : "",
                boardNum: "",
                commentTxt : "",
                userId : "ryan9320",
            },
            updateComment:{
                commentNum : "",
                boardNum: "",
                commentTxt : "",
                userId : "ryan9320",
            },
            updateCommentTxt : "",
            commentList : [],
            oneList : [],
            fileList : [],
            fileIds : [],
            imageUrl : [],
            images : {}
        }
    },
    methods:{
        load(){
          this.boardOne()
        },
        async boardOne(){
          try{
            const res = await this.axios.get("/board/one?boardNum="+encodeURIComponent(this.$route.query.boardNum))
            const { boardDTO,fileList } = res.data;
            this.board = boardDTO;
            this.fileList = fileList;
            this.comment.boardNum = this.board.boardNum;
            this.updateComment.boardNum = this.board.boardNum;

            for(var i=0; i < fileList.length;i++ ){
              var fileData = fileList[i];

              this.fileIds.push(fileData.fileId);
              this.getImageUrl(fileData.fileId);
            }
            this.cmList();
          } catch (ex) {
            console.error("failed write article", ex);
          }          
        },

        getImageUrl(fileId) { 
          if (!this.images[parseInt(fileId)]) {
            this.images[parseInt(fileId)] = "";
            axios
              .get("/getImage/" + fileId, { responseType: "blob" })
              .then((response) => {
                //console.log("res: ",response.data);
                const reader = new FileReader();
                reader.onload = () => {
                  this.images[parseInt(fileId)] = reader.result;
                };
                reader.readAsDataURL(response.data);
              })
              .catch((error) => {
                console.log(error);
              });            
          }
          //console.log("this.images: ",this.images);
        },

        closeInfo(){
            $router.back();
        },
        /**
         * @todo 업데이트
         */
        boardUpdate(){
          this.$router.push({path:'/update',query: {boardNum: this.board.boardNum}})
        },

        boardOneDelete(bnum){
            this.oneList.push(bnum);
            var params = {
                checkList : Object.values(this.oneList) 
            }
            this.boardDelete(params)
        },

        boardDelete(params){
          this.axios.get("/board/delete?checkList="+encodeURIComponent(JSON.stringify(params.checkList)))
          .then(res => {
            console.log(res.data);  
            this.$router.push({path:'/'})
          })
          .catch((ex)=>{
            console.error("failed write aricle",ex);
          })
        },

        filedown(fileId){
          this.axios.get("/file-download/"+fileId,{
            responseType: "blob"
          })
          .then(res => {
            console.log(res)

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            
            console.log(res.headers['content-disposition'])
            console.log(fileId);
            
            const filename = res.headers['content-disposition'] ? res.headers['content-disposition'].split('"')[1] : fileId;
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();

          })
          .catch((ex)=>{
            console.error("failed write aricle",ex);
          })
        },
        /******************************/
        
        //댓글
        
        /************************************************************************* */
        cmAdd(){
            
            var commentTxt =this.comment.commentTxt;

            if(commentTxt==""){
              alert("내용을 입력해주세요")
            }else{
              console.log(this.comment)
              this.axios.post("/comment/insert",this.comment)
              .then(res => {
                  console.log(res.data);
                  if(res.data.result=='Y'){
                      this.cmList()
                  }
              })
              .catch((ex)=>{
                console.error("err:"+ex)
              })
            }
        },
        cmList(){
            //console.log(this.board.boardNum);
            this.axios.get("/comment/selectOne?boardNum=" +this.board.boardNum)
            .then(res => {
                this.commentList = res.data.commentList;
            })
            .catch((ex)=>{
              console.error("err:"+ex)
            })
        },
        cmUpdateform(commentNum,commentTxt){
          this.updateComment.commentNum = commentNum;
          this.commentUpdate = true;
          this.updateComment.commentTxt = commentTxt;
        },    
        cmCancle(){
          this.commentUpdate = false;
          this.updateComment.commentNum = "";
          this.updateComment.commentTxt = "";
        },   
        cmUpdate(commentNum){
            let commentTxt = this.updateComment.commentTxt;

            if(commentTxt==""){
              alert("댓글 내용을 입력해주세요")
            }else{
              this.axios.post("/comment/update",this.updateComment)
              .then(res => {

                  console.log(res.data)
                  this.commentUpdate = false;
                  this.cmList();
                  this.updateComment.commentNum = "";
                  this.updateComment.commentTxt = "";
              })
              .catch((ex)=>{
                console.error("err:"+ex)
              })
            }
        },
        cmDelete(commentNum){
          
          this.axios.get("/comment/delete?commentNum=" +commentNum)
            .then(res => {
                console.log(res.data.result);
                this.cmList();
            })
            .catch((ex)=>{
              console.error("err:"+ex)
            })
        }
    }
}

</script>