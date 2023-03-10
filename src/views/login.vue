<template>
  <div>
    <div>
        아이디: <input v-model="login.userId" type="text">
    </div>
    <div>
        비밀번호 : <input v-model="login.userpw" type="password">
    </div>
    <button @click= "() => loginfn()">로그인</button>
    <button><router-link to="/memberjoin">회원가입</router-link></button>        
  </div>  
</template>

<script>
export default {
    name: "login",
    data() {
        return {
            login:{
                userId : "",
                userpw : ""
            }
        }
    },
    methods: {
        loginfn () {
            console.log("1:",this.login.userId)
            console.log("2:",this.login.userpw)
        }
    },
}
</script>

<style>

</style>