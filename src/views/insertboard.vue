<template>
    <div id="app">
      <div class="container">
        <input type="hidden" v-model="board.userId">  
        <div>
          <p>제목</p>
          <input type="text" class="form-control" v-model="board.boardTitle"/>
        </div>
        <div>
          <p>
            내용 
            <button @click="imgfilebtnClick">이미지등록</button>
          </p>
          <img :src="imgfiles">
          <textarea v-model="board.boardTxt" rows="10"></textarea>
        </div>
        <div>
          태그: <input v-model="board.boardTag">
        </div>
        <div>
          <button @click="filebtnClick">파일등록</button>
          
        </div>
        <div>
          <form id="imgfileForm" name = "imgfileForm">
            <input type="file" ref="boardimgfile" id="boardimgfile" @change="uploadimgFile()" accept="image/*" hidden>
          </form>
        </div>  
        <div>
          <input ref="boardfile" id="boardfile" type="file" multiple @change="uploadFile()" hidden>
          <div>
              <p>첨부파일</p>
              <ul>
                <li v-for="(file,idx) in content_files" :key="idx">
                  {{file.name}}<button @click="fileDelete(file.fileNum)">삭제</button>
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
  
  import { file } from '@babel/types';
import axios from 'axios'
  
  export default {
    name: 'updateboard',
    data () {
      return {
          board: {
            boardTitle: '',
            boardTxt: '',
            boardTag: '',
            userId: 'ryan9320',
            fileIdxs : []
          },
          
          fileCnt : 0,
          fileNum : 0,
          totalCnt: 10,

          deleteFiles : [],   //삭제 파일
          files : [],         //업로드용 파일
          content_files : [], //등록 파일
          
          imgfiles : [],
          filesPreviw:[],
          uploadImageIndex : 0 //이미지 업로드를 위한 변수
      }    
    },
    methods : {
      //이미지 파일 등록
      imgfilebtnClick(){
        document.getElementById('boardimgfile').click();
      },
      //이미지 파일 등록 및 프리뷰
      uploadimgFile(ev){

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

      //파일 등록
      filebtnClick(){
        document.getElementById('boardfile').click();
      },
      //그냥 파일 등록
      uploadFile(e){
        console.log("files: ",this.$refs.boardfile.files) 
        this.files = this.$refs.boardfile.files
        
        //const files = this.$refs.boardfile.files;
        
        const selectedFiles = [];
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

            this.content_files[parseInt(this.fileNum)].is_delete = false;
            this.content_files[parseInt(this.fileNum)].fileNum = this.fileNum;
                          
            this.fileNum ++;
          }
          selectedFiles.push(f);

          reader.readAsDataURL(f)

        });

        console.log(selectedFiles)

        this.content_files = content_files;
        this.selectedFiles = selectedFiles;

        console.log("content_files:")
        console.log(this.content_files)
        //document.getElementById("boardfile").value = "";
      },
      
      fileDelete(fileNum){
          
          this.content_files[parseInt(fileNum)].is_delete = true; 
          document.getElementById(fileNum).remove()

          this.fileCnt --
      },

      save : function() {
        var boardTitle = this.board.boardTitle;
        var boardTxt = this.board.boardTxt;

        if(boardTitle==""){
          alert("제목을 입력해주세요")
        }else if(boardTxt==""){
          alert("내용을 입력해주세요")
        }else{
          //this.board.fileIdxs = fileIdxs;
          //console.log("this.board: ", this.board.fileIdxs)

          this.axios.post('/board/insert', this.board)
          .then((data)=>{
            console.log(data.data.YN);
            if(data.data.YN=="Y"){
              //this.$router.push('/')
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

          //console.log("content_files: ",content_files);
          
          for(var i=0;i<this.content_files.length;i++){
            //console.log(content_files[i]);
            if(!this.content_files[i].is_delete){
              formData.append("article_file",content_files[i]);
              formData.append("filePath","/vue/boardfile");
            }
          }

          //console.log(JSON.stringify(formData));
          
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

    },
    

  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  
  </style>
  