<template>
  <div class="index">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="请求地址">
        <el-input v-model="form.path"></el-input>
      </el-form-item>
      <el-form-item label="请求方法">
        <el-select v-model="form.method" placeholder="请选择">
          <el-option
            v-for="item in methods"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary">发送请求</el-button>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios';
import { reactive } from 'vue';
// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md
export default {
  name:"Index",
  setup() {
    const form = reactive({
      path: '',
      method: '',
      headers: {},
      data: {},
    });
    const methods = reactive(['POST', 'GET', 'DELETE', 'PUT']);

    const setStore = function (key, data) {
      if (!key) {
        return undefined;
      }
      window.localStorage.setItem(key, JSON.stringify(data));
    };

    const getStore = function (key) {
      if (!key) {
        return undefined;
      }
      const data = window.localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      } else {
        return data;
      }
    };
    return { form };
  },
};
</script>

<style>
.index {
  width: 800px;
}
</style>
