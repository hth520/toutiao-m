<template>
 <div class="home-container">
 <van-nav-bar class="page-nav-bar">
     <van-button class="search-btn" slot="title" size="small" round icon="search">
         搜索
     </van-button>
 </van-nav-bar>

 <!-- 频道列表 -->
<van-tabs class="channel-tabs"  v-model="active" animated swipeable>
  <van-tab :title="item.name" v-for="item in channels" :key="item.id">
      <!-- 文章列表 -->
      <article-list :channel="item"></article-list>
  </van-tab>
  <div slot="nav-right" class="placeholder"></div>
  <div slot="nav-right" class="hamburger-btn">
      <i class="toutiao toutiao-gengduo"></i>
  </div>
</van-tabs>
 </div>
</template>
<script>
import { getUserChannels } from '@/api/user'
import articleList from './components/article-list.vue'
export default {
  name: 'HomeIndex',
  components: {
    articleList
  },
  data () {
    return {
      active: 0,
      channels: [] // 频道列表
    }
  },
  created () {
    this.loadChannels()
  },
  computed: {
  },
  methods: {
    async loadChannels () {
      try {
        const { data } = await getUserChannels()
        this.channels = data.data.channels
      } catch (err) {
        this.$toast('获取频道数据失败')
      }
    }
  }
}
</script>
<style lang='less'  scoped>
    .home-container{
        padding-bottom: 100px;
        ::v-deep.van-nav-bar__title{
            max-width: unset;
        }
        .search-btn{
            width: 555px;
            height: 64px;
            background-color: #5babfb;
            border: none;
            font-size: 28px;
            color: #fff;
            .van-icon{
                font-size: 32px;
            }
        }
         ::v-deep.channel-tabs{
             .van-tabs__wrap{
                 height: 82px;
             }
           .van-tab{
                min-width: 200px;
                height: 82px;
                border-right:1px solid #edeff3 ;
                font-size: 30px;
            }
            .van-tab--active{
                color: #333333;
            }
            .van-tabs__nav{
                padding-bottom: 0;
            }
            .van-tabs__line{
                bottom: 8px;
                width: 31px !important;
                height: 6px;
                background-color: #3296fa;
            }
            .placeholder{
                flex-shrink: 1;
                width: 66px;
                height: 82px;
            }
            .hamburger-btn{
                position: fixed;
                right: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 66px;
                height: 82px;
                background-color: #fff;
                opacity: 0.902;
               i.toutiao{
                   font-size: 33px;
               }
               &::before{
                   content: "";
                   width: 1px;
                   height: 100%;
                   background-image: url('~@/assets/gradient-gray-line.png');
               }
            }
        }
    }
</style>
