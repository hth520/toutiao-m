<template>
 <div class="home-container">
 <van-nav-bar class="page-nav-bar" fixed>
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
  <div slot="nav-right" class="hamburger-btn" @click="isChennelEditShow=true">
      <i class="toutiao toutiao-gengduo"></i>
  </div>
</van-tabs>

<!-- 频道编辑弹出层 -->
<van-popup
  v-model="isChennelEditShow"
  closeable
  close-icon-position="top-left"
  position="top"
  :style="{ height: '100%' }"
>
<!-- 频道编辑组件 -->
<channel-edit :my-channels="channels" :active="active" @update-active="onUpdateActive"></channel-edit>
</van-popup>
 </div>
</template>
<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list.vue'
import ChannelEdit from './components/channel-edit.vue'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  data () {
    return {
      active: 0,
      channels: [], // 频道列表
      isChennelEditShow: false // 控制编辑频道的弹出层
    }
  },
  created () {
    this.loadChannels()
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async loadChannels () {
      try {
        // let channels = []
        if (this.user) {
          const { data } = await getUserChannels()
          this.channels = data.data.channels
        } else {
          const localChannels = getItem('TOUTIAO_CHANNELS')
          if (localChannels) {
            this.channels = localChannels
          } else {
            const { data } = await getUserChannels()
            this.channels = data.data.channels
          }
        }
      } catch (err) {
        this.$toast('获取频道数据失败')
      }
    },
    onUpdateActive (index, isChennelEditShow = true) {
      this.active = index
      this.isChennelEditShow = isChennelEditShow
    }
  }
}
</script>
<style lang='less'  scoped>
    .home-container{
        padding-top: 174px;
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
                 position: fixed;
                 top:92px;
                 z-index: 1;
                 left: 0;
                 right: 0;
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
