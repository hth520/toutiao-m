<template>
 <div class="search-suggestion">
     <van-cell v-for="
     (text,index) in suggestions" :key="index"   icon="search" @click="$emit('search',text)">
     <div slot="title" v-html="highlight(text)"></div>
     </van-cell>
 </div>
</template>
<script>
import { getSearchSuggestion } from '@/api/search'

// 按需加载有好处：只会把使用到的成员打包
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: [] // 联想建议数据列表
    }
  },
  created () {
  },
  computed: {
  },
  watch: {
    searchText: {
    //   handler (val) {
    //     this.loadSearchSuggestions(val)
    //   },
      handler: debounce(function (val) {
        console.log(val, '监听输入')
        this.loadSearchSuggestions(val)
      }, 300),
      immediate: true
    }
  },
  methods: {
    async loadSearchSuggestions (q) {
      try {
        const { data } = await getSearchSuggestion(q)
        console.log(data)
        this.suggestions = data.data.options
      } catch (err) {
        this.$toast('数据获取失败，请稍候重试')
      }
    },
    highlight (text) {
      console.log(text, '文字')
      const highlightStr = `<span class="active">${this.searchText}</span>`
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, highlightStr)
    }
  }
}
</script>
<style lang='less'  scoped>
    .search-suggestion{
        /deep/ span.active{
            color:#3296fa;
        }
    }
</style>
