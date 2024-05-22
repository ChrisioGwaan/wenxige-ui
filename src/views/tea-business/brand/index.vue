<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, CircleCheckFilled, CircleCloseFilled } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { createBrand, getBrandById, updateBrand, deleteBrand, batchDeleteBrand } from "@/api/brand"
import { getTableDataPage } from "@/api/brand"
import {
  CreateOrUpdateBrandRequestData,
  batchDeleteTableRequestData,
  Brand,
  GetTableData
} from "@/api/brand/types/table"

defineOptions({
  name: "ElementPlus"
})

// #selection start
let multipleSelection = []
// #selection end
const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

// #region create
const DEFAULT_FORM_DATA: CreateOrUpdateBrandRequestData = {
  id: undefined,
  brandName: "",
  originYear: "",
  comment: ""
}
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = ref<CreateOrUpdateBrandRequestData>(JSON.parse(JSON.stringify(DEFAULT_FORM_DATA)))
const formRules: FormRules<CreateOrUpdateBrandRequestData> = {
  brandName: [{ required: true, trigger: "blur", message: "品牌名稱不能為空！" }],
  originYear: [{ required: true, trigger: "blur", message: "品牌創立年份不能為空！" }],
  comment: [{ required: false, trigger: "blur", message: "備註不能為空！" }]
}
const handleCreateOrUpdate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      loading.value = true
      const api = formData.value.id === undefined ? createBrand : updateBrand
      api(formData.value)
        .then(() => {
          ElMessage({
            message: "新增成功！",
            type: "success",
            plain: true
          })
          dialogVisible.value = false
          getTableData()
        })
        .catch((error) => {
          ElMessage({
            message: `Error: ${error.message}`,
            type: "error",
            plain: true
          })
        })
        .finally(() => {
          loading.value = false
        })
    }
  })
}
const resetForm = () => {
  formRef.value?.clearValidate()
  formData.value = JSON.parse(JSON.stringify(DEFAULT_FORM_DATA))
}
// #endregion

// #region delete
const handleDelete = (row: Brand) => {
  ElMessageBox.confirm(`你確定要刪除 ${row.brandName} ?`, "產品刪除提示", {
    confirmButtonText: "確定",
    cancelButtonText: "再諗下",
    type: "warning"
  }).then(() => {
    deleteBrand(row.id).then(() => {
      ElMessage.success("刪除成功！")
      getTableData()
    })
  })
}

const handleBatchDelete = () => {
  if (multipleSelection.length === 0) {
    ElMessage.warning("請選擇需要刪除的產品！")
    return
  }
  ElMessageBox.confirm("確定要刪除嗎？", "刪除提示", {
    confirmButtonText: "確定",
    cancelButtonText: "再諗下",
    type: "warning"
  }).then(() => {
    const data: batchDeleteTableRequestData = { brandIds: multipleSelection }
    batchDeleteBrand(data)
      .then(() => {
        ElMessage.success("刪除成功！")
        getTableData()
      })
      .catch((error) => {
        ElMessage.error(`刪除失敗：${error.msg}`)
      })
  })
}
// #endregion

// #region update
const handleUpdate = (row: GetTableData) => {
  dialogVisible.value = true
  getBrandById(row.id)
    .then((response) => {
      formData.value = response.data
    })
    .catch((error) => {
      ElMessage({
        message: `Error: ${error.message}`,
        type: "error",
        plain: true
      })
    })
}
// #endregion

//#region search
const tableData = ref<GetTableData[]>([])
const searchFormRef = ref<FormInstance | null>(null)

let searchData = reactive({
  brandName: "",
  originYear: "",
  dataRange: []
})
const getTableData = () => {
  loading.value = true
  getTableDataPage({
    current: paginationData.currentPage || 1,
    size: paginationData.pageSize || 10,
    brandName: searchData.brandName || "",
    originYear: searchData.originYear || "",
    startDate: searchData.dataRange ? searchData.dataRange[0] : "",
    endDate: searchData.dataRange ? searchData.dataRange[1] : ""
  })
    .then(({ data }) => {
      paginationData.total = data.total
      tableData.value = data.records
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
const handleSearch = () => {
  paginationData.currentPage === 1 ? getTableData() : (paginationData.currentPage = 1)
}
const resetSearch = () => {
  searchData.brandName = ""
  searchData.originYear = ""
  searchData.dataRange = []
  handleSearch()
}
// #endregion
const handleSelectionChange = (selection: GetTableData[]) => {
  multipleSelection = selection.map((item) => item.id)
  console.log(multipleSelection)
}

const handleYearChange = (val: any) => {
  if (val) {
    formData.value.originYear = val.getFullYear().toString()
  } else {
    formData.value.originYear = ""
  }
}

/** Watch if queries are different based on the page results */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData" label-width="120px" label-position="left">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item prop="brandName" label="品牌名稱：" style="width: 100%">
              <el-input v-model="searchData.brandName" placeholder="請輸入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="originYear" label="品牌創立年份：" style="width: 100%">
              <el-input v-model="searchData.originYear" placeholder="請輸入" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item prop="createTime" label="創建時間：" style="width: 600px">
          <el-date-picker
            v-model="searchData.dataRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="開始日期"
            end-placeholder="結束日期"
            value-format="YYYY-MM-DD HH:mm:ss"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="success" :icon="Search" @click="handleSearch">查詢</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置查詢項</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增品牌</el-button>
          <el-button type="danger" :icon="Delete" @click="handleBatchDelete">批量刪除品牌</el-button>
        </div>
        <!--        <div>-->
        <!--          <el-tooltip content="導出Excel">-->
        <!--            <el-button type="primary" :icon="Download" circle />-->
        <!--          </el-tooltip>-->
        <!--          <el-tooltip content="刷新查詢頁">-->
        <!--            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData" />-->
        <!--          </el-tooltip>-->
        <!--        </div>-->
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData" v-loading="loading" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="100" align="center" />
          <el-table-column type="index" label="序号" width="150px" align="center" />
          <el-table-column prop="brandName" label="品牌名稱" align="center" width="450px" />
          <el-table-column prop="originYear" label="品牌創立年份" align="center" width="200px" />
          <el-table-column prop="createTime" label="創建時間" align="center" width="200px" />
          <el-table-column prop="modifiedTime" label="更新時間" align="center" width="200px" />
          <el-table-column prop="isLock" label="狀態" align="center" width="200px">
            <template #default="scope">
              <el-switch
                v-model="scope.row.isLock"
                :active-icon="CircleCheckFilled"
                :inactive-icon="CircleCloseFilled"
                active-value="0"
                inactive-value="1"
                style="--el-switch-on-color: #8cfa9e; --el-switch-off-color: #f56c6c"
              />
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="250" header-align="center" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">編輯</el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">刪除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- Create/update -->
    <el-dialog
      v-model="dialogVisible"
      :close-on-click-modal="false"
      :title="formData.id === undefined ? '🌟新增品牌' : '✏️編輯品牌'"
      @closed="resetForm"
      width="50%"
    >
      <div class="title">品牌信息</div>
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="150px" label-position="left">
        <el-form-item prop="brandName" label="品牌名稱">
          <el-input v-model="formData.brandName" placeholder="輸入品牌名稱" clearable />
        </el-form-item>
        <el-form-item prop="originYear" label="品牌創立年份">
          <el-date-picker
            v-model="formData.originYear"
            type="year"
            placeholder="輸入品牌創立年份"
            @change="handleYearChange"
            clearable
          />
        </el-form-item>
        <el-form-item prop="comment" label="備註">
          <el-input
            v-model="formData.comment"
            placeholder="輸入備註"
            type="textarea"
            maxlength="512"
            show-word-limit
            :autosize="{ minRows: 2, maxRows: 12 }"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button color="#626aef" @click="handleCreateOrUpdate" :loading="loading" plain>提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.title {
  font-size: 16px;
  color: #0052d9;
  margin-top: 10px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;

  &::before {
    content: "";
    display: inline-block;
    width: 3px;
    height: 30px;
    margin-right: 10px;
    background-color: #0052d9;
  }
}

.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
  overflow: hidden;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
