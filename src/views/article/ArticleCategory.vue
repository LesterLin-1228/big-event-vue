<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ref } from 'vue'
const categories = ref([

])
// 聲明一個異步函數
import { articleCategoryListService } from '@/api/article.js'
const articleCategoryList = async () => {
    let result = await articleCategoryListService();
    categories.value = result.data;
}
articleCategoryList();

</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>文章分類</span>
                <div class="extra">
                    <el-button type="primary">添加分類</el-button>
                </div>
            </div>
        </template>
        <el-table :data="categories" style="width: 100%">
            <el-table-column label="編號" width="100" type="index"> </el-table-column>
            <el-table-column label="分類名稱" prop="categoryName"></el-table-column>
            <el-table-column label="分類别名" prop="categoryAlias"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary"></el-button>
                    <el-button :icon="Delete" circle plain type="danger"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="沒有數據" />
            </template>
        </el-table>
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
}
</style>