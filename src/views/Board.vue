/**
* Created by OXOYO on 2019/6/12.
*
* Board
*/

<style scoped lang="less" rel="stylesheet/less"></style>

<template>
  <div class="view">
    <BoardBox></BoardBox>
  </div>
</template>

<script>
  import BoardBox from '../components/BoardBox/Index'

  export default {
    name: 'Board',
    components: {
      BoardBox
    },
    created () {
      let _t = this
      let boardList = _t.$store.getters.boardList
      // 恢复已保存的画板；没有历史数据时新建一块
      if (!boardList.length) {
        _t.$store.commit('board/list/add', {
          id: new Date().getTime(),
          screenshot: ''
        })
        boardList = _t.$store.getters.boardList
      }
      let index = _t.$store.getters.activeBoardIndex
      if (index === null || !boardList[index]) {
        _t.$store.commit('board/activeBoardIndex/update', 0)
      }
    }
  }
</script>
