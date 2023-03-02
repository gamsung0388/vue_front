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
          <!-- <button @click="imgfilebtnClick">이미지등록</button> -->
          <input ref="boardimgfile" id="boardimgfile" type="file" @change="uploadimgFile()" hidden>
          <textarea rows="10" v-model="board.boardTxt"></textarea>
        </div>
        <div>
          태그: <input type="text" v-model="board.boardTag">
        </div>
        <div>
          <button @click="filebtnClick">파일등록</button>
          
        </div>
        <div>
            <input ref="boardfile" id="boardfile" type="file" multiple @change="uploadFile()"  accept="image/*" hidden>
            <div id="data_file_txt">
                <p>첨부파일</p>
                <ul>
                  <li v-for="(file,idx) in selectedFiles" :key="idx" :id="file.fileId">
                    <img :src="imgfiles">
                    {{file.name}}
                    <button @click="beforefileDelete(file.fileId)">삭제</button>
                  </li>
                  <li v-for="(file,idx) in content_files" :key="idx"  :id="file.fileNum">
                    {{file.name}}
                    <button @click="fileDelete(file.fileNum)">삭제</button>
                  </li>
                </ul>
            </div>        
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
                fileIdxs : [],
                delete_files : []
            },
            imgfiles : [],
            fileCnt : 0,
            fileNum : 0,
            totalCnt: 10,
            uploadImageIndex : 0, //이미지 업로드를 위한 변수

            deleteFiles : [],   //삭제 파일
            files : [],         //업로드용 파일
            selectedFiles : [],
            content_files : [], //등록 파일
            
        }
    },
    methods : {
        load(){
            this.axios.get("/board/updateForm?boardNum="+encodeURIComponent(this.$route.query.boardNum))
            .then(res => {
                console.log(res.data);  
                
                //boardDetail
                this.board = res.data.boardDTO;   

                //파일
                var fileList = res.data.fileList;

                for(var i=0;i<fileList.length;i++){

                    var fileData = fileList[i];
                    console.log("fileData: ",fileData);
                          
                    this.selectedFiles.push(fileData);
                    
                }
                //console.log(this.board);

            })
            .catch((ex)=>{
                console.error("failed write aricle",ex);
            })
        },
        //이미지 파일 클릭
        imgfilebtnClick(){
            document.getElementById('boardimgfile').click();
        },
        //이미지 파일 등록
        uploadimgFile(e){
            //console.log("files: ",this.$refs.boardimg.files)

            var files = this.$refs.boardimgfile.files[0];
            
            if(files){
                console.log("imgfile:",files)  
                var reader = new FileReader();
                reader.onload = (e) => {
                    this.imgfiles = e.target.result;
                }
                reader.readAsDataURL(files); 
            }           
        },
        //파일 클릭
        filebtnClick(){
            document.getElementById('boardfile').click();
        },
        //그냥 파일 등록
        uploadFile(e){
            console.log("files: ",this.$refs.boardfile.files) 
            this.files = this.$refs.boardfile.files

            console.log(this.files);

            var filesArr = Array.prototype.slice.call(this.files);

            if(this.fileCnt + filesArr.length > this.totalCnt){
                alert("파일은 최대"+this.totalCnt+"개까지 업로드 할 수 있습니다.")
                return false;
            }else{
                this.fileCnt = this.fileCnt + filesArr.length;
            }

            filesArr.forEach( f => {
            
                var reader = new FileReader();
                console.log("fileNum3: ",this.fileNum);
                reader.onload = () => {
                    console.log(f);
                    this.content_files.push(f);

                    this.content_files[parseInt(this.fileNum)].is_delete = false;
                    this.content_files[parseInt(this.fileNum)].fileNum = this.fileNum;

                    this.fileNum ++;
                }
            
                console.log("2content_files: "); 
                console.log(this.content_files); 
                                
                reader.readAsDataURL(f)

            });
                        
        },

        beforefileDelete(fileId){

            this.deleteFiles.push(fileId);
            document.getElementById(fileId).remove()
        },

        fileDelete(fileNum){
            this.content_files[parseInt(fileNum)].is_delete = true; 
            document.getElementById(fileNum).remove()
            this.fileCnt--;
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
                this.board.delete_files = this.deleteFiles
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
            console.log(this.fileCnt)
            if(this.fileCnt > 0 ){
                console.log("추가파일이 있을 때")
                var formData = new FormData();

                //console.log("content_files: ",content_files);
                
                for(var i=0;i<this.content_files.length;i++){
                    console.log(this.content_files[i]);
                    if(!this.content_files[i].is_delete){
                        formData.append("article_file",this.content_files[i]);
                        formData.append("filePath","/vue/boardfile");
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