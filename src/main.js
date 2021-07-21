import { createApp } from 'vue'
import App from './App.vue'
import {ElForm,ElFormItem,ElCard,ElButton,ElInput,ElSelect,ElOption,ElScrollbar,ElTable,ElTableColumn} from 'element-plus';
import JsonViewer from "vue3-json-viewer"
import 'element-plus/lib/theme-chalk/index.css';
const app = createApp(App)

app.component(ElForm.name,ElForm)
app.component(ElInput.name,ElInput)
app.component(ElTable.name,ElTable)
app.component(ElTableColumn.name,ElTableColumn)
app.component(ElScrollbar.name,ElScrollbar)
app.component(ElOption.name,ElOption)
app.component(ElSelect.name,ElSelect)
app.component(ElFormItem.name,ElFormItem)
app.component(ElButton.name,ElButton)
app.component(ElCard.name,ElCard)
app.use(JsonViewer)
app.config.globalProperties.$ELEMENT = {
    size:"small"
}
app.mount('#app')
