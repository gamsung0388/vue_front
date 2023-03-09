<template>
    <div>
        <div>댓글{{ boardNum }}</div>
        <div>
            <input type="text" v-model="comment.commentTxt">
        </div> 
        <div>
            <div v-for="(commentData,idx) in commentList" :key='idx'>
                <p>{{ commentData.userId}} 
                    <button @click="cmUpdate(commentData.commentNum)">수정</button>
                    <button @click="cmDelete(commentData.commentNum)">삭제</button>
                </p>                  
                <div>
                {{ commentData.commentTxt }}
                </div>      
            </div>
        </div>
    </div>
</template>
<script>

export default({
    name: "comment",
    mounted() {
        console.log(this.boardNum)
        this.cmLoad();
    },
    computed : {
        load(){
            if(this.boardNum != ""){
                this.cmLoad();
            }
        }
    },
    props : {
        boardNum: {
            type : String,
            required : true,
            default : 30
        }
    },
    data () {
        return{
            comment:{
                commentNum : "",
                boardNum: "",
                commentTxt : "",
                userId : "ryan9320",
            },
            commentList : []
        }
    },
    computed : {
        
    },
    methods : {
        cmLoad(){
            this.cmList();
        },
        cmAdd(){
            this.comment.boardNum = this.boardNum;
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
            
        },
        cmList(){
            console.log(this.boardNum);
            this.axios.get("/comment/select?boardNum=" +this.boardNum)
            .then(res => {

                this.commentList = res.data.commentList;
                
            })
            .catch((ex)=>{

            })
        },
        cmUpdate(commentNum){
            
            this.axios.post("/comment/update",this.comment)
            .then(res => {

                console.log(res.data)

            })
            .catch((ex)=>{

            })
        },
        cmDelete(commentNum){
            
            this.axios.get("/comment/delete?commentNum=" +this.commentNum)
            .then(res => {

                console.log(res.data.result);

            })
            .catch((ex)=>{

            })

        }
    }

})
</script>
