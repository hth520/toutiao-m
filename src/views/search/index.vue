<template>
 <div class="search-container">

     <!-- 搜索栏 -->
 <form class="searchForm" action="/">
  <van-search
    v-model="searchText"
    show-action
    placeholder="请输入搜索关键词"
    background="#3296fa"
    @search="onSearch"
    @cancel="onCancel"
    @focus="isResultShow = false"
  />
</form>

<!-- 搜索结果 -->
<search-result v-if="isResultShow" :search-text="searchText" />

<!-- 联想建议 -->
<search-suggestion v-else-if="searchText" :search-text="searchText" @search="onSearch"
  />
<!-- 搜索历史记录 -->
<search-history v-else  />

 </div>
</template>
<script>
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import SearchResult from './components/search-results'
import { Toast } from 'vant'
export default {
  name: 'SearchIndex',
  data () {
    return {
      searchText: '',
      isResultShow: false // 控制搜索结果的展示
    }
  },
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  created () {
  },
  computed: {
  },
  methods: {
    onSearch (val) {
      this.searchText = val
      this.isResultShow = true
    },
    onCancel () {
      Toast('取消')
    }
  }
}
</script>
<style lang='less'  scoped>
.search-container {
    padding-top: 108px;
    .van-search__action {
        color:#fff
    }
    .searchForm {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1;
    }
}
</style>
