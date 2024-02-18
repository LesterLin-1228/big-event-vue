<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'

import { ref } from 'vue'

// 文章分類數據模型
const categories = ref([])

// 用戶搜索時選中的分類id
const categoryId = ref('')

// 用戶搜索時選中的發布狀態
const state = ref('')

// 文章列表數據模型
const articles = ref([])

// 分頁條數據模型
const pageNum = ref(1) // 當前頁
const total = ref(20) // 總條數
const pageSize = ref(5) // 每頁條數

// 當每頁條數發生了變化，調用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    articleList()
}
// 當前頁碼發生變化，調用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
    articleList()
}

// 調用接口獲取文章分類數據
import { articleCategoryListService, articleListService, articleAddService, articleUpdateService, articleDeleteService } from '@/api/article.js'
const articleCategoryList = async () => {
    let result = await articleCategoryListService();

    categories.value = result.data;
}
articleCategoryList();

// 獲取文章列表數據
const articleList = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        categoryId: categoryId.value ? categoryId.value : null,
        state: state.value ? state.value : null
    }
    let result = await articleListService(params);

    // 渲染視圖
    total.value = result.data.total;
    articles.value = result.data.items;

    // 處理數據，給數據模型擴展一個屬性categoryName(分類名稱)
    for (let i = 0; i < articles.value.length; i++) {
        let article = articles.value[i];
        for (let j = 0; j < categories.value.length; j++) {
            if (article.categoryId == categories.value[j].id) {
                article.categoryName = categories.value[j].categoryName;
            }
        }

    }
}
articleList();

// 導入富文本編輯器
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { Plus } from '@element-plus/icons-vue'
//控制抽屉是否顯示
const visibleDrawer = ref(false)
//添加表單數據模型
const articleModel = ref({
    title: '',
    categoryId: '',
    coverImg: '',
    content: '',
    state: ''
})

// 導入token
import { useTokenStore } from '@/stores/token.js';
const tokenStore = useTokenStore();

// 上傳成功的回調函數
const uploadSuccess = (result) => {
    articleModel.value.coverImg = result.data;
    console.log(result.data);
}

// 添加文章
import { ElMessage, ElMessageBox } from 'element-plus';
const formRef = ref(null)
const addArticle = async (clickState) => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            // 把發布狀態賦值給數據模型
            articleModel.value.state = clickState;

            // 調用接口
            let result = await articleAddService(articleModel.value);
            ElMessage.success('添加成功')

            // 讓抽屜消失
            visibleDrawer.value = false;

            // 刷新當前列表
            articleList();
        }
    })
}

// 定義變數控制文章標題的展示
const articleTitle = ref('')
// 展示編輯抽屜
const showDrawer = (row) => {
    visibleDrawer.value = true;
    articleTitle.value = '修改文章';
    // 數據拷貝
    articleModel.value.title = row.title;
    articleModel.value.categoryId = row.categoryId;
    articleModel.value.coverImg = row.coverImg;
    articleModel.value.content = row.content;
    articleModel.value.state = row.state;
    // 擴展id屬性，傳到後端完成文章的修改
    articleModel.value.id = row.id;
}
// 修改文章
const updateArticle = async (clickState) => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            // 把發布的狀態賦值給數據模型
            articleModel.value.state = clickState;
            // 調用修改文章接口
            let result = await articleUpdateService(articleModel.value);
            ElMessage.success('修改成功');
            articleList();
            visibleDrawer.value = false;
        }
    })
}
// 清空數據模型
const clearData = () => {
    articleModel.value.title = '';
    articleModel.value.categoryId = '';
    articleModel.value.coverImg = '';
    // 富文本編輯器無法辨識，需要用<p></p>來代替
    articleModel.value.content = '<p></p>';
    articleModel.value.state = '';
    console.log('content=' + articleModel.value.content);
}

// 刪除文章
const deleteArticle = (row) => {
    ElMessageBox.confirm(
        '確認刪除該文章?',
        '溫馨提示',
        {
            confirmButtonText: '確認',
            cancelButtonText: '取消',
            type: 'warning',
        })
        .then(async () => {
            // 調用接口
            let result = await articleDeleteService(row.id);
            ElMessage({
                type: 'success',
                message: '刪除成功',
            })
            // 刷新列表
            articleList();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消刪除',
            })
        })
}

//添加文章表單校驗
const rules = {
    title: [
        { required: true, message: '请输入標題', trigger: 'blur' },
        {
            pattern: /^\S{1,20}$/,
            message: '必须是1-20位的字，不包含空白',
            trigger: 'blur'
        }
    ],
    categoryId: [
        { required: true, message: '请输入分類', trigger: 'blur' },
    ],
    coverImg: [
        { required: true, message: '请選擇封面', trigger: 'blur' },
    ]

}

</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>文章管理</span>
                <div class="extra">
                    <el-button type="primary"
                        @click="visibleDrawer = true; articleTitle = '添加文章'; clearData()">添加文章</el-button>
                </div>
            </div>
        </template>
        <!-- 搜尋表單 -->
        <el-form inline>
            <el-form-item label="文章分類：">
                <el-select placeholder="請選擇" v-model="categoryId">
                    <el-option v-for="c in categories" :key="c.id" :label="c.categoryName" :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="發布狀態：">
                <el-select placeholder="請選擇" v-model="state">
                    <el-option label="已發布" value="已發布"></el-option>
                    <el-option label="草稿" value="草稿"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="articleList()">搜尋</el-button>
                <el-button @click="categoryId = ''; state = ''; articleList()">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 文章列表 -->
        <el-table :data="articles" style="width: 100%">
            <el-table-column label="文章標題" width="400" prop="title"></el-table-column>
            <el-table-column label="分類" prop="categoryName"></el-table-column>
            <el-table-column label="發布時間" prop="createTime"> </el-table-column>
            <el-table-column label="狀態" prop="state"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="showDrawer(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteArticle(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="沒有數據" />
            </template>
        </el-table>
        <!-- 分頁條 -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[5, 10, 15]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
        <!-- 抽屉 -->
        <el-drawer v-model="visibleDrawer" :title="articleTitle" direction="rtl" size="50%">
            <!-- 添加文章表單 -->
            <el-form ref="formRef" :model="articleModel" :rules="rules" label-width="100px">
                <el-form-item label="文章標題" prop="title">
                    <el-input v-model="articleModel.title" placeholder="請輸入標題"></el-input>
                </el-form-item>
                <el-form-item label="文章分類" prop="categoryId">
                    <el-select placeholder="請選擇" v-model="articleModel.categoryId">
                        <el-option v-for="c in categories" :key="c.id" :label="c.categoryName" :value="c.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文章封面" prop="coverImg">
                    <!-- 
                        auto-upload:設置是否自動上傳
                        action:設置伺服器接口路徑
                        name:設置上傳的文件字段名
                        headers:設置上傳的請求頭
                        on-success:設置上傳成功的回調函數
                     -->
                    <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false" action="/api/upload"
                        name="file" :headers="{ 'Authorization': tokenStore.token }" :on-success="uploadSuccess">
                        <img v-if="articleModel.coverImg" :src="articleModel.coverImg" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="文章内容">
                    <div class="editor">
                        <quill-editor theme="snow" v-model:content="articleModel.content" contentType="html">
                        </quill-editor>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"
                        @click="articleTitle == '添加文章' ? addArticle('已發布') : updateArticle('已發布')">發布</el-button>
                    <el-button type="info"
                        @click="articleTitle == '添加文章' ? addArticle('草稿') : updateArticle('草稿')">草稿</el-button>
                    <el-button @click="visibleDrawer = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </el-card>
</template>
<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .el-select {
        --el-select-width: 220px;
    }
}

/* 抽屉樣式 */
.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}

.editor {
    width: 100%;

    :deep(.ql-editor) {
        min-height: 300px;
    }
}
</style>