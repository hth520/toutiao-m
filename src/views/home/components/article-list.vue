<template>
 <div class="article-list">
     <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :success-text="refreshSuccessText"  :success-duration="1500">
    <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            :error.sync="error"
            error-text="请求失败，点击重新加载"
            @load="onLoad"
        >
        <article-item v-for="(article,index) in list" :key="index" :article="article"></article-item>
            <!-- <van-cell v-for="(article,index) in list" :key="index" :title="article.title" /> -->
        </van-list>
</van-pull-refresh>

 </div>
</template>
<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  components: {
    ArticleItem
  },
  name: 'ArticleList',
  data () {
    return {
      list: [], // 存储列表数据的数据
      loading: false, // 控制加载中 loading 状态
      finished: false, // 控制数据加载结束的状态
      refreshing: false, // 控制数据加载结束的状态
      timestamp: null, // 请求获取下一页数据的时间戳
      error: false, // 控制失败时候的提示
      isLoading: false, // 控制下拉时候的状态
      refreshSuccessText: '刷新成功' // 下拉刷新成功提示文本
    }
  },
  created () {
  },
  computed: {
  },
  methods: {
    async onLoad () {
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: this.timestamp || Date.now(),
          with_top: 1
        })
        const { results } = data.data
        this.list.push(...results)
        this.loading = false
        // 判断数据是否全部加载完成
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了  将finished 设置为 true,不再load 加载更多
          this.finished = true
        }
      } catch (err) {
        this.error = true
        // 请求失败了，loading 也需要关闭
        this.loading = false
      }
    },
    // 当下拉刷新的时候会触发调用该函数
    async onRefresh () {
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now(),
          with_top: 1
        })
        this.list.unshift(...data.data.results)
        const { results } = data.data
        this.list.unshift(...results)
        this.isLoading = false
        // 更新下拉刷新成功提示文本
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (err) {
        this.isLoading = false
        this.refreshSuccessText = '刷新失败'
      }
    }
  }
}
</script>
<style lang='less'  scoped>
    .article-list {
        // 百分比单位是相对于父元素的
        // height: 100%;
        height: 79vh;
        overflow-y: auto;
    }
</style>
