<template>
 <div class="serch-results">
     <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="加载失败了，请稍候重试"
        @load="onLoad"
        >
        <van-cell v-for="(item,index) in list" :key="index" :title="item.title" />
        </van-list>
 </div>
</template>
<script>
import { getSearchResult } from '@/api/search'
export default {
  name: 'SearchResults',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 20,
      error: false
    }
  },
  created () {
  },
  computed: {
  },
  methods: {
    async onLoad () {
      try {
        // 1. 请求获取数据
        const { data } = await getSearchResult({
          page: this.page, // 页码
          per_page: this.perPage, // 每页大小
          q: this.searchText // 查询关键词
        })
        console.log(data)
        // 2.将数据添加到数据列表中
        const { results } = data.data
        this.list.push(...results)
        // 3.将本次加载中的loading关闭
        this.loading = false
        // 4.判断是否还有数据
        if (results.length) {
          // 有，更新获取下一条数据页码
          this.page++
        } else {
          // 没有，则加载状态 finsihed设置为结束
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
        this.$toast('数据获取失败，请稍候重试')
      }
    }
  }
}
</script>
<style lang='less'  scoped>

</style>
