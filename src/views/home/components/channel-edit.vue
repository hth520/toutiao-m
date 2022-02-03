<template>
 <div class="channel-edit">

     <!-- 我的频道 -->
     <van-cell :border="false">
         <div slot="title" class="title-text">我的频道</div>
         <van-button type="danger"
          plain
          round
          size="mini"
          class="edit-btn"
          @click="isEdit = !isEdit"
          >{{isEdit ? '完成' : '编辑'}}</van-button>
     </van-cell>
     <van-grid class="my-grid" :gutter="10">
  <van-grid-item class="grid-item"  v-for="(channel,index) in myChannels" :key="index" @click="onMyChannelClick(channel,index)">
      <van-icon v-show="isEdit && !fiexdChannels.includes(channel.id)"  slot="icon"  name="clear"></van-icon>
      <span class="text"  :class="{active: index === active}"  slot="text">{{channel.name}}</span>
  </van-grid-item>
</van-grid>

<!-- 频道推荐 -->
     <van-cell >
         <div slot="title" class="title-text">频道推荐</div>
     </van-cell>
     <van-grid class="recommend-grid"  :gutter="10">
  <van-grid-item icon="plus"  class="grid-item"  v-for="(channel,index) in recommendChannels" :key="index" :text="channel.name" @click="onAddChannel(channel)" />
</van-grid>
 </div>
</template>
<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [], // 所有频道
      isEdit: false, // 控制编辑状态的显示
      fiexdChannels: [0] // 固定频道，不允许删除
    }
  },
  created () {
    this.loadAllChannels()
  },
  computed: {
    ...mapState(['user']),
    recommendChannels () {
      return this.allChannels.filter(channel => {
        return !this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })
      })
    //   const channels = []
    //   this.allChannels.forEach(channel => {
    //     const ret = this.myChannels.find(myChannel => {
    //       return myChannel.id === channel.id
    //     })
    //     if (!ret) {
    //       channels.push(channel)
    //     }
    //   })
    //   return channels
    }
  },
  methods: {
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },
    async onAddChannel (channel) {
      this.myChannels.push(channel)
      //   数据持久化处理
      if (this.user) {
        try {
        // 已登录 把数据请求接口放到线上
          addUserChannel({
            id: channel.id, // 频道ID
            seq: this.myChannels.length // 序号
          })
        } catch (err) {
          this.$toast('保存失败，请稍候重试')
        }
      } else {
        // 未登录，把数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    onMyChannelClick (channel, index) {
      // 如果是编辑状态执行删除频道
      if (this.isEdit) {
        if (this.fiexdChannels.includes(channel.id)) {
          return
        }
        // 删除频道项
        this.myChannels.splice(index, 1)
        if (index <= this.active) {
          this.$emit('update-active', this.active - 1, true)
        }
        // 处理持久化
        this.deleteChannel(channel)
      } else {
        this.$emit('update-active', index, true)
      }
    },
    async deleteChannel (channel) {
      try {
        if (this.user) {
        // 已登录
          await deleteUserChannel(channel.id)
        } else {
        //   未登录将数据更新到本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        this.$toast('操作失败，请稍候重试')
      }
    }
  }
}
</script>
<style lang='less'  scoped>
    .channel-edit {
        padding: 85px 0;
        .title-text {
            font-size: 32px;
            color: #333333;
        }
        .edit-btn {
            width: 104px;
            height: 48px;
            font-size: 26px;
            color: #f85959;
            border: 1px solid #f85959;
        }
        /deep/ .grid-item {
            width: 160px;
            height: 86px;
           .van-grid-item__content {
               white-space: nowrap;
                 background-color: #f4f5f6;
                .van-grid-item__text,.text{
                    font-size: 28px;
                    color: #222;
                    margin-top: unset;
                }
                .active{
                    color: red;
                }
                .van-grid-item__icon-wrapper{
                    position: unset;
                }
                  .van-grid-item__content {
                      font-style: 28px;
                      color: #222;
                  }
           }
        }
        /deep/ .my-grid {
            .grid-item {
                .van-icon-clear{
                position: absolute;
                right: -10px;
                top: -10px;
                font-size: 30px;
                color: #cacaca;
                z-index: 2;
                }
            }
        }
       /deep/  .recommend-grid{
            .grid-item {
                  .van-grid-item__content {
                    flex-direction:row;
                    .van-icon-plus{
                        font-size: 28px;
                        margin-right: 6px;
                    }
                  }
            }
        }
    }
</style>
