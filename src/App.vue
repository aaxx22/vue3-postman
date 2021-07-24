<template>
  <div class="index">
    <el-form
      ref="form"
      :model="reqConfig"
      label-width="100px"
      v-loading="isLoading"
    >
      <el-form-item label="请求地址">
        <el-input
          v-model="reqConfig.url"
          placeholder="请输入请求地址"
        ></el-input>
      </el-form-item>
      <el-form-item label="请求方法">
        <el-select v-model="reqConfig.method" placeholder="请选择">
          <el-option
            v-for="item in methods"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请求头信息">
        <div class="df">
          <el-select
            v-model="reqHeaders.key"
            allow-create
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in routineHeaders"
              :key="item"
              :value="item"
              :label="item"
            >
            </el-option>
          </el-select>
          <el-input v-model="reqHeaders.value" @keyup.enter="onAddHeader">
            <template #suffix>
              <el-button
                type="primary"
                icon="el-icon-plus"
                @click="onAddHeader"
              ></el-button>
            </template>
          </el-input>
        </div>
        <el-table :data="reqConfig.headers" style="width: 100%">
          <el-table-column prop="key" label="key" width="180">
          </el-table-column>
          <el-table-column prop="value" label="value">
            <template #default="scope">
              <div class="line2" :title="scope.row.value">
                <span>{{ scope.row.value }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="请求参数">
        <!-- <div class="df">
          <el-select
            v-model="reqData.key"
            allow-create
            filterable
            placeholder="请选择"
          >
          </el-select>
          <el-input v-model="reqData.value" @keyup.enter="onAddData">
            <template #suffix>
              <el-button
                type="primary"
                icon="el-icon-plus"
                @click="onAddData"
              ></el-button>
            </template>
          </el-input>
        </div>
        <el-table :data="reqConfig.data" style="width: 100%">
          <el-table-column prop="key" label="key" width="180">
          </el-table-column>
          <el-table-column prop="value" label="value">
            <template #default="scope">
              <div class="line2" :title="scope.row.value">
                <span>{{scope.row.value}}</span>
              </div>
            </template>
          </el-table-column>
        </el-table> -->
        <vue-json-editor
          v-model="reqConfig.data"
          :show-btns="true"
          :expandedOnStart="true"
          @json-change="onJsonChange"
          mode="code"
          lang="zh"
          :showBtns="false"
        />
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="onSubmit">发送请求</el-button>
      </el-form-item>
    </el-form>
    <div style="margin-left: 100px">
      <p>{{ resJson.msg }}</p>
      <json-viewer :value="resJson.val" copyable boxed sort></json-viewer>
    </div>
    <div class="history">
      <el-card>
        <template #header>
          <div class="card-head">
            <div class="title">历史请求</div>
            <el-input
              v-model="search"
              placeholder="请输入关键词"
              @input="handleSearch"
              clearable
            ></el-input>
          </div>
        </template>
        <div v-if="record">
          <el-scrollbar height="550px" style="padding-right: 10px">
            <div
              class="item"
              v-for="(item, index) in record"
              :key="index"
            >
              <div class="body">
                <div class="url">{{ item.url }}</div>
                <div class="method">{{ item.method }}</div>
                <el-table :data="reqTable" style="width: 100%">
                  <el-table-column prop="label" label="类型" width="80">
                  </el-table-column>
                  <el-table-column prop="prop" label="值">
                    <template #default="scope">
                      <div class="line2 content">
                        <div
                          class="tip-item line2"
                          v-for="(item, key) in item[scope.row.key]"
                          :key="key"
                        >
                          <div>{{ key }}:</div>
                          <div>{{ item }}</div>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="label"
                    label="操作"
                    width="80"
                    fixed="right"
                  >
                    <template #default="scope">
                      <el-button
                        type="text"
                        @click="viewJson(item[scope.row.key])"
                        >json详情</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="opt">
                <el-button type="text" size="small" @click="delRecord(index)"
                  >删除</el-button
                >
                <el-button type="text" size="small" @click="fillIn(item)"
                  >填入</el-button
                >
              </div>
            </div>
          </el-scrollbar>
        </div>
        <div class="tac" v-else>暂无记录</div>
      </el-card>
    </div>
  </div>
  <el-dialog title="JSON查看" v-model="dialogVisible" width="700px">
    <div>
      <json-viewer :value="jsonData" copyable boxed sort></json-viewer>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script>
import axios from 'axios';
import { reactive, watch,toRefs } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Vue3JsonEditor } from 'vue3-json-editor';

// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md
export default {
  name: 'Index',
  components: {
    VueJsonEditor: Vue3JsonEditor,
  },
  setup() {
    const reqTable = reactive([
      {
        label: '请求头信息',
        key: 'headers',
      },
      {
        label: '请求参数',
        key: 'data',
      },
      {
        label: '返回信息',
        key: 'returns',
      },
    ]);
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
    const routineHeaders = reactive(['x-token', 'X-Token', 'Authorization']);
    const methods = reactive(['POST', 'GET', 'DELETE', 'PUT']);

    const reqHeaders = reactive({
      key: '',
      value: '',
    });
    const reqData = reactive({
      key: '',
      value: '',
    });
    let resJson = reactive({
      val: {},
      msg: '',
    });

    const state = reactive({
      record: getStore('record'),
      reqConfig: {
        url: '',
        method: 'GET',
        headers: [],
        data: {},
      },
      search: '',
      dialogVisible: false,
      jsonData: {},
      isLoading: false,
    });

    function onJsonChange(value) {
      console.log('value:', value);
    }

    const handleSearch = function () {
      const arr = getStore('record');
      state.search = state.search.trim();
      if (!state.record) return;
      const newArr = arr.filter((item) => {
        return item.url.indexOf(state.search) != -1;
      });
      // console.log()
      state.record = newArr;
    };
    const delRecord = function (index) {
      ElMessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          state.record.splice(index, 1);
          setStore('record', state.record);
        })
        .catch(() => {});
    };
    const fillIn = function (item) {
      state.reqConfig['url'] = item.url;
      state.reqConfig['method'] = item.method;
      state.reqConfig['headers'] = Object.keys(item.headers).map((key) => {
        return {
          key,
          value: item.headers[key],
        };
      });
      console.log(state.reqConfig['headers']);
      state.reqConfig['data'] = Object.keys(item.data).map((key) => {
        return {
          key,
          value: item.data[key],
        };
      });
      // console.log(state.reqConfig);
    };
    const isEmpty = function (val) {
      if (!val) return true;
      if (JSON.stringify(val) === '{}' || JSON.stringify(val) === '[]')
        return true;
      return false;
    };
    const onSubmit = function (e) {
      // console.log(state.reqConfig);
      const { url, method, headers, data } = state.reqConfig;
      state.isLoading = true;
      if (!url) {
        ElMessage.error('url不能为空');
        state.isLoading = false;
        return;
      }
      if (!method) {
        state.isLoading = false;
        ElMessage.error('method不能为空');
        return;
      }
      const config = { url, method };
      if (!url) return;
      if (!method) return;
      config['headers'] = {};
      headers.forEach((item) => {
        config['headers'][item.key] = item.value;
      });
      config['data'] = {};
      data.forEach((item) => {
        config['data'][item.key] = item.value;
      });
      axios(config)
        .then((res) => {
          resJson.msg = '返回信息';
          resJson.val = res.data;
          // setStore()
          const arr = getStore('record') || [];
          const obj = {
            url,
            method,
            headers: config['headers'],
            data: config['data'],
            returns: res.data,
          };
          arr.push(obj);
          setStore('record', arr);
          state.record = getStore('record');
          state.isLoading = false;
          // console.log(resJson)
        })
        .catch((err) => {
          resJson.msg = '报错信息';
          state.isLoading = false;
          resJson.val = err;
        });
    };
    const viewJson = function (e) {
      state.jsonData = e;
      state.dialogVisible = true;
    };
    const onAddHeader = function () {
      const { key, value } = reqHeaders;
      if (!key) {
        ElMessage.error('key不能为空');
        return;
      }
      if (!value) {
        ElMessage.error('value不能为空');
        return;
      }
      state.reqConfig.headers.push(JSON.parse(JSON.stringify(reqHeaders)));
      clearObj(reqHeaders);
    };
    const onAddData = function () {
      const { key, value } = reqData;
      if (!key) {
        ElMessage.error('key不能为空');
        return;
      }
      if (!value) {
        ElMessage.error('value不能为空');
        return;
      }
      state.reqConfig.data.push(JSON.parse(JSON.stringify(reqData)));
      clearObj(reqData);
    };

    const clearObj = function (target) {
      if (!target) return;
      Object.keys(target).forEach((item) => (target[item] = ''));
    };

    return {
      ...toRefs(state),
      reqHeaders,
      methods,
      onSubmit,
      onAddHeader,
      reqData,
      routineHeaders,
      onAddData,
      resJson,
      isEmpty,
      delRecord,
      fillIn,
      handleSearch,
      reqTable,
      viewJson,
      onJsonChange,
    };
  },
};
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
