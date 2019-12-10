<template>
<div class="login">
    <!--<div class="login-form">
      <div class="login-header">
        <img src="../../../asset/images/logo.png" height="100" alt="">
        <p>IBlog</p>
      </div>
      <div class="login-info">
        <el-input
            placeholder="请输入用户名"
            suffix-icon="fa fa-user"
            v-model="userName"
            style="margin-bottom: 18px"
        >
        </el-input>

        <el-input
            placeholder="请输入密码"
            suffix-icon="fa fa-keyboard-o"
            v-model="password"
            type="password"
            style="margin-bottom: 18px"
        >
        </el-input>
      </div>
      
      <el-button
          type="primary"
          style="width: 100%;margin-bottom: 18px"
          @click.native="login">登录</el-button>
      <div>
        <el-checkbox class="login-remember" v-model="remenber">记住密码</el-checkbox>
        <a href="javascript:;" style="float: right;color: #3C8DBC;font-size: 14px">注册</a>
      </div>
    </div>-->
    {{ errcode }}
    {{ errmsg }}
</div>
</template>

<style>
@import "login.css";
</style>

<script type="text/babel">
import Vue from "vue";
import createStore from '../../store/index';
/*import {
  Input,
  Button,
  Checkbox
} from 'element-ui';*/
//Vue.component(Input.name, Input);
//Vue.component(Button.name, Button);
//Vue.component(Checkbox.name, Checkbox);
export default {
  data() {
    return {
      errcode: "",
      errmsg: "",
      url: location.href
    };
  },
  created() {
    //const store = createStore(initState);
    console.log(window.__INITIAL_STATE__)
    var user = window.__INITIAL_STATE__.user;
    this.errcode = user.errcode;
    this.errmsg = user.errmsg;

    // 登录失败，则延时后跳去登录
    if(this.errcode != 0) {
      this.url = this.replaceParams(location.href, 'code');
      this.url = this.replaceParams(this.url, 'state');
      this.url = this.replaceParams(this.url, 'appid');

      setTimeout(()=>{
        this.login();
      }, 4000);
    }
  },
  methods: {
    login() {
      window.location.replace(this.url);
    },
    replaceParams(url, name) {
      return url.replace(new RegExp(`(&|\\?){1}${name}=[^&#]*?(&|#|$)`, 'gi'),function(){return arguments[1]=='?'?'?':arguments[2]})
    }
  }
};
</script>