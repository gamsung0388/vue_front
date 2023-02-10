<template>
    <div id="app">
        <table>
            <input type="hidden" v-text="item.userId">
            <tr>
              <th>제목</th>
              <td>{{item.boardTitle}}</td>
            </tr>
            <tr>
              <th>본문</th>
              <td>
                <span v-text="item.boardTxt">
                </span>
              </td>
            </tr>
        </table>
        <div>
            <button @click="deleteArticle(item.userId)">삭제</button>
            <button @click="moveUpdateArticle(item.userId)">수정</button>
        </div> 
    </div>
</template>
<script>
import router from '@/router';
import selectData from './selectList'


export default {
    name : "detailboard",
    props : {
        selectData:{
            type:String,
            default:'',
            required:false,
            validator:(val)=>true
        }
    },
    data (){
        return {
            item : selectData
        }
    },
    created(){
        //console.log(this.router)
    }
}

</script>