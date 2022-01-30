<template>
  <div class="login-container">
      <van-nav-bar class="page-nav-bar" title="登录"/>

      <!-- 导航表单 -->
      <van-form @submit="onSubmit" ref="loginForm">
        <van-field
            name="mobile"
            placeholder="请输入手机号"
            maxlength="11"
            v-model="user.mobile"
            :rules="userFormRules.mobile"
        >
         <i slot="left-icon" class="toutiao toutiao-shouji"></i>
        </van-field>
        <van-field
            type="password"
            name="code"
            maxlength="6"
            placeholder="请输入验证码"
            v-model="user.code"
            :rules="userFormRules.code"
        >
         <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
         <template #button>
             <!-- 倒计时组件 -->
             <van-count-down v-if="isCountDownShow" :time="1000 * 60" format="ss s" @finish="isCountDownShow = false"/>
         <van-button v-else round  class="send-sms-btn" native-type="button" @click="onSendSms">发送验证码</van-button>
         </template>
        </van-field>
        <div class="login-btn-wrap">
            <van-button class="login-btn"  block type="info" native-type="submit">登录</van-button>
        </div>
        </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
// import { Toast } from 'vant'
export default {
  name: 'LoginPage',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '13911111111', // 13911111111
        code: '246810' // 246810
      },
      userFormRules: {
        mobile: [{
          required: true,
          message: '手机号不能为空'
        }, {
          pattern: /1[3 | 5 | 7 | 8]\d{9}$/,
          message: '手机号格式错误'
        }],
        code: [{
          required: true,
          message: '验证码不能为空'
        }, { pattern: /^\d{6}$/, message: '验证码格式错误' }]
      },
      isCountDownShow: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onSubmit () {
    //   1.获取表单数据
      const user = this.user
      //  2.表单验证

      // 在组件中必须通过 this.$toast 来调用 Toast 组件
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true, // 禁用背景点击
        duration: 0
      })
      // 3. 体检表单请求登录
      try {
        console.log(user)
        const { data } = await login(user)
        this.$store.commit('setUser', data.data)
        this.$toast.success('登录成功')
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登陆失败，请稍候重试')
        }
      }
    },
    async onSendSms () {
      console.log('onSendSms')
      try {
        // 1. 校验手机号
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return console.log('验证失败', err)
      }

      // 2.验证通过，显示倒计时
      this.isCountDownShow = true
      // 3.请求发送验证码
      try {
        const res = await sendSms(this.user.mobile)
        console.log('发送成功', res)
      } catch (err) {
        // 发送失败关闭倒计时
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('发送太频繁了，请稍后重试')
        } else {
          this.$toast('发送失败，请稍候再试')
        }
      }
    }
  }
}
</script>
<style scoped lang="less">
.login-container {
    .toutiao{
        font-size:37px ;
    }
.send-sms-btn {
    height: 46px;
    font-size: 22px;
    background-color: #ededed;
    color: #666;
    .van-button__text{
        width: 100%;
    }
}
    .van-button--normal {
        padding: 0 8px;
    }
    .login-btn-wrap{
          padding: 53px 33px;
        .login-btn {
          background-color: #6db4fb;
          border: none;
        }
    }
}
</style>
