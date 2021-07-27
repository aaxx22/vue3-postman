<template>
  <index />
</template>

<script setup>
import index from './components/index.vue';

// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md
</script>

<style scoped lang="less">
* {
  margin: 0;
  padding: 0;
}
/deep/.jsoneditor-poweredBy {
  display: none;
}
.content {
  max-height: 50px;
  overflow: hidden;
}
.value {
  max-width: 250px;
  max-height: 150px;
  min-height: 16px;
  word-wrap: break-word;
  overflow: auto;
}
.df {
  display: flex;
}
.tip-item {
  margin-bottom: 5px;
}
.tac {
  text-align: center;
}
.card-head {
  display: flex;
  align-items: center;
  .title {
    width: 100px;
  }
}
.index {
  width: 800px;
  margin-top: 20px;
  div {
    max-width: 800px;
  }
}
/deep/.el-input__suffix {
  right: 0;
}
.line2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.history {
  width: 500px;
  height: 600px;
  position: fixed;
  top: 10px;
  right: 10px;
}
.history {
  .item {
    border-bottom: 1px solid #eee;
    // padding: 10px 0;
    padding-top: 10px;
    padding-bottom: 40px;
    position: relative;
    .url {
      font-size: 14px;
      padding: 5px 0;
    }
    .method {
      display: inline-block;
      padding: 2px 10px;
      border: 1px solid #282c34;
      border-radius: 4px;
      font-size: 12px;
      color: #999;
    }
    .header,
    .data {
      font-size: 13px;
      p {
        line-height: 18px;
      }
    }
    .opt {
      position: absolute;
      bottom: 5px;
      right: 10px;
    }
    .return {
      font-size: 13px;
      width: 95%;
    }
    .body {
      overflow: hidden;
      div {
        word-wrap: break-word;
      }
    }
  }
}
</style>
