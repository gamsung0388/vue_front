<template>
    <div id="app">
      <div class="container">
        <input type="hidden" v-model="board.userId">  
        <div>
          <p>제목</p>
          <input type="text" class="form-control" v-model="board.boardTitle" />
        </div>
        <div>
          <p>내용</p>
          <textarea rows="10" v-model="board.boardTxt"></textarea>
        </div>
        <div>
          태그: <input type="text" v-model="board.boardTag">
        </div>
        <div>
          <button @click="filebtnClick">파일등록</button>
        </div>
        <div>
          <form id="fileForm" name="fileForm">
            <input ref="boardfile" id="boardfile" type="file" multiple @change="uploadFile()" hidden>
            <div id="data_file_txt">
                <p>첨부파일</p>
                <div id="articleFileChange">
                </div>
            </div>
          </form>          
        </div>
        <div>
          <button @click="fileSave">저장</button> 
          <button @click="$router.back()">취소</button>
        </div>
      </div>
    </div>
</template>
<script>

import router from '@/router';
import axios from 'axios';

var content_files = new Array();
var fileNum = 0;      //파일 고유 넘버
var fileIdxs = "";    //파일 시퀀스들
var deleteFiles = []; //삭제된 파일 리스트

export default({
    name: "updateboard",
    
    created() {
        
    },
    mounted() {
        this.load();
    },
    data () {
        return {
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
            fileCnt : 0,
            fileNum : 0,
            totalCnt: 10,
            fileHTML : "",
            files : [],    //업로드용 파일
            content_files : [],
            filesPreviw:[],
            uploadImageIndex : 0, //이미지 업로드를 위한 변수

        }
    },
    methods : {
        load(){
            this.axios.get("/board/one?boardNum="+encodeURIComponent(this.$route.query.boardNum))
            .then(res => {
                console.log(res.data);  

                this.board = res.data.boardDTO;
                this.files = res.data.fileList;                
                var fileList = res.data.fileList;

                for(var i=0;i<fileList.length;i++){
                    var changehtml = document.createElement('div')
                    changehtml.innerHTML = 
                        ' <font>' + fileList[i].ORIG_NM + '</font>'
                        + ' <button>삭제</button>'
                    
                    changehtml.classList.add("sr-only")
                    document.getElementById("articleFileChange").appendChild(changehtml);
                }
                //console.log(this.board);

            })
            .catch((ex)=>{
                console.error("failed write aricle",ex);
            })
        },
        //파일 등록
        filebtnClick(){
            document.getElementById('boardfile').click();
        },
        //그냥 파일 등록
        uploadFile(e){
            console.log("files: ",this.$refs.boardfile.files) 
            this.files = this.$refs.boardfile.files

            console.log(this.files)

            var filesArr = Array.prototype.slice.call(this.files);

            if(this.fileCnt + filesArr.length > this.totalCnt){
            alert("파일은 최대"+this.totalCnt+"개까지 업로드 할 수 있습니다.")
            return false;
            }else{
            this.fileCnt = this.fileCnt + filesArr.length;
            }

            filesArr.forEach( f => {
            
            var reader = new FileReader();
            reader.onload = () => {
                content_files.push(f);
                content_files[fileNum].is_delete = false;
                
                // 파일 삭제 및 view
                
                var changehtml = document.createElement('div')
                changehtml.innerHTML = 
                    ' <font>' + f.name + '</font>'
                    + ' <button>삭제</button>'
                
                changehtml.classList.add("sr-only")
                document.getElementById("articleFileChange").appendChild(changehtml);
                            
                fileNum ++;
            }
            reader.readAsDataURL(f)

            });
            this.content_files = content_files;
            console.log(this.content_files)
            document.getElementById("boardfile").value = "";
            
        },

        fileDelete(fileNum){
            console.log(fileNum)
            
        },

        save : function() {
            //console.log(this.board);
            var boardTitle = this.board.boardTitle;
            var boardTxt = this.board.boardTxt;

            if(boardTitle==""){
                alert("제목을 입력해주세요")
            }else if(boardTxt==""){
                alert("내용을 입력해주세요")
            }else{
                this.axios.post('/board/update', this.board)
                .then((data)=>{
                    if(data.data.YN=="Y"){
                        this.$router.push('/')
                    }else{
                     alert("서버 오류");
                    } 
                })
                .catch((ex)=>{
                    console.error("failed write aricle",ex)
                })
            }
        },
        fileSave () {
            if(this.fileCnt > 0 ){
                console.log("추가파일이 있을 때")
                var Imgform = document.getElementById("fileForm")
                var formData = new FormData();

                console.log("content_files: ",content_files);
                
                for(var i=0;i<content_files.length;i++){
                    console.log(content_files[i]);
                    if(!content_files[i].is_delete){
                        formData.append("article_file",content_files[i]);
                        formData.append("filePath","/board/main");
                    }
                }

                console.log(JSON.stringify(formData));
                
                this.axios.post('/file-upload', formData,{
                    header:{ "Content-type" : "multipart/form-data"},
                }).then((data)=>{
                console.log(data.data)
                
                if(data.data.result == "OK"){
                    this.board.fileIdxs = data.data.fileIdxs;
                    this.save()
                }else{
                    alert("서버내 오류로 처리가 지연되고있습니다. 잠시 후 다시 시도해주세요");
                }

                }).catch((ex)=>{
                    console.error("failed write aricle",ex)
                })
            }else{
                console.log("추가파일이 없을 때")
                this.save()
            }
        },
    }

})
</script>
<style>

</style>