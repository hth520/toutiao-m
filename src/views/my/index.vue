<template>
 <div class="my-container">

     <!-- 已登录 -->
     <div v-if="user" class="header user-info">
         <div class="base-info">
             <div class="left">
                 <van-image
                 class="avatar"
                    :src="userInfo.photo"
                    fit="cover"
                    round
                    />
                    <span class="name">{{userInfo.name}}</span>
             </div>
             <div class="right">
                 <van-button size="mini" round>编辑资料</van-button>
             </div>
         </div>
         <div class="data-stats">
             <div class="data-item">
                 <div class="count">{{userInfo.art_count}}</div>
                 <div class="text">头条</div>
             </div>
             <div class="data-item">
                <div class="count">{{userInfo.follow_count}}</div>
                 <div class="text">关注</div>
             </div>
             <div class="data-item">
                <div class="count">{{userInfo.fans_count}}</div>
                 <div class="text">粉丝</div>
             </div>
             <div class="data-item">
                <div class="count">{{userInfo.like_count}}</div>
                 <div class="text">获赞</div>
             </div>
         </div>
     </div>
     <!-- 未登录 -->
     <div v-else  class="header not-login">
         <div class="login-btn" @click="$router.push('/login')">
             <img class="mobile-img" src="~@/assets/mobile.png" alt="">
             <span class="text">登录 / 注册</span>
         </div>
     </div>

        <!-- 导航 -->
     <van-grid :column-num="2" class="grid-nav" clickable>
    <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-shoucang"></i>
        <span slot="text" class="text">收藏</span>
    </van-grid-item>
        <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-lishi"></i>
        <span slot="text"  class="text">历史</span>
    </van-grid-item>
    </van-grid>

    <!-- 消息通知 小智同学 -->
    <van-cell title="消息通知" is-link></van-cell>
    <van-cell title="小智同学" is-link></van-cell>
    <van-cell clickable  v-if="user" class="logout-cell" title="退出登录" @click="onLogout"></van-cell>
 </div>
</template>
<script>
import { getUserInfo } from '@/api/user'
import { mapState } from 'vuex'

export default {
  name: 'MyIndex',
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    if (this.user) {
      this.loadUserInfo()
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    //   退出登录
    onLogout () {
      this.$dialog.confirm({
        title: '确定退出吗？'
      })
        .then(() => {
          // on confirm
          this.$store.commit('setUser', '')
        })
        .catch(() => {
          // on cancel
        })
    },

    // 获取用户请求
    async loadUserInfo () {
      try {
        const { data } = await getUserInfo()
        this.userInfo = data.data
      } catch (err) {
        this.$toast('获取数据失败，请稍候重试')
      }
    }
  }
}
</script>
<style lang='less'  scoped>
.my-container{
    .header{
        height: 361px;
        background: url("~@/assets/banner.png") no-repeat ;
        background-size: cover;
    }
    .not-login {
        display: flex;
        justify-content: center;
        align-items: center;
        .login-btn{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .mobile-img{
                width: 132px;
                height: 132px;
            }
            .text{
                font-size: 28px;
                color: #fff;
                margin-top: 15px;
            }
        }
    }
    .user-info{
        .base-info {
            height: 131px;
            padding: 76px 32px 23px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .left {
                display: flex;
                align-items: center;
                .avatar {
                    width: 132px;
                    height: 132px;
                    margin-right: 23px;
                    border: 5px solid #fff;
                }
                .name{
                    font-size: 30px;
                    color: #fff;
                }
            }
        }
        .data-stats {
            height:130px;
            display: flex;
            .data-item{
                height: 130px;
                flex: 1;
                display:flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                  color:#fff;
                .count{
                    font-size: 36px;
                }
                .text{
                    font-size: 23px;
                }
            }
        }
    }

    .grid-nav{
        .grid-item {
            height: 141px;
            i.toutiao{
                font-size: 45px;
            }
            .toutiao-shoucang{
                color: #eb5253;
            }
            .toutiao-lishi{
                color: #ff9d1d;
            }
            span.text {
            font-size: 28px;
            }
        }
    }
    .logout-cell{
        margin-top: 5px;
    text-align: center;
    color: #d98989;
    }
}
</style>
