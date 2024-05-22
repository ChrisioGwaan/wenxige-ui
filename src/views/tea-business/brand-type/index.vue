<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, CircleCheckFilled, CircleCloseFilled } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import {
  BrandType,
  CreateOrUpdateBrandTypeRequestData,
  batchDeleteTableRequestData,
  GetTableData
} from "@/api/brand-type/types/table"
import {
  batchDeleteBrandType,
  createBrandType,
  deleteBrandType,
  getBrandTypeById,
  updateBrandType,
  getTableDataPage
} from "@/api/brand-type"
import { Brand } from "@/api/brand/types/table"
import { dropDownList } from "@/api/brand"

defineOptions({
  name: "ElementPlus"
})

// #selection start
let multipleSelection = []
// #selection end
const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

// #region create
const DEFAULT_FORM_DATA: CreateOrUpdateBrandTypeRequestData = {
  id: undefined,
  brandId: undefined,
  brandTypeName: "",
  comment: ""
}
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = ref<CreateOrUpdateBrandTypeRequestData>(JSON.parse(JSON.stringify(DEFAULT_FORM_DATA)))
const formRules: FormRules<CreateOrUpdateBrandTypeRequestData> = {
  brandId: [{ required: true, trigger: "blur", message: "請選擇一個品牌！" }],
  brandTypeName: [{ required: true, trigger: "blur", message: "品牌創立年份不能為空！" }],
  comment: [{ required: false, trigger: "blur", message: "備註不能為空！" }]
}
const handleCreateOrUpdate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      loading.value = true
      const api = formData.value.id === undefined ? createBrandType : updateBrandType
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
const handleDelete = (row: BrandType) => {
  ElMessageBox.confirm(`你確定要刪除 ${row.brandTypeName} ?`, "產品刪除提示", {
    confirmButtonText: "確定",
    cancelButtonText: "再諗下",
    type: "warning"
  }).then(() => {
    deleteBrandType(row.id).then(() => {
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
    const data: batchDeleteTableRequestData = { brandTypeIds: multipleSelection }
    batchDeleteBrandType(data)
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
  getBrandTypeById(row.id)
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
  brandId: "",
  dataRange: []
})
const getTableData = () => {
  loading.value = true
  getTableDataPage({
    current: paginationData.currentPage || 1,
    size: paginationData.pageSize || 10,
    brandId: searchData.brandId || "",
    startTime: searchData.dataRange ? searchData.dataRange[0] : "",
    endTime: searchData.dataRange ? searchData.dataRange[1] : ""
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
  searchData.brandId = ""
  searchData.dataRange = []
  handleSearch()
}
// #endregion
const handleSelectionChange = (selection: GetTableData[]) => {
  multipleSelection = selection.map((item) => item.id)
}

const brandOptions = ref<Brand[]>([])

const fetchBrandOptions = (args: string) => {
  console.log(args)
  loading.value = true
  dropDownList(args)
    .then((response) => {
      brandOptions.value = response.data
      loading.value = false
    })
    .catch((error) => {
      ElMessage({
        message: `Error: ${error.msg}`,
        type: "error",
        plain: true
      })
    })
    .finally(() => {
      loading.value = false
    })
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
              <el-select
                v-model="searchData.brandId"
                filterable
                remote
                :remote-method="fetchBrandOptions"
                :loading="loading"
                placeholder="請輸入"
                clearable
                remote-show-suffix
              >
                <el-option
                  v-for="item in brandOptions"
                  :key="item.brandName"
                  :label="item.brandName"
                  :value="item.id"
                />
              </el-select>
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
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增品牌種類</el-button>
          <el-button type="danger" :icon="Delete" @click="handleBatchDelete">批量刪除</el-button>
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
          <el-table-column type="index" label="序号" width="80px" align="center" />
          <el-table-column prop="brandName" label="品牌名稱" align="center" width="300px" />
          <el-table-column prop="brandTypeName" label="品牌種類名稱" align="center" width="300px" />
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
      :title="formData.id === undefined ? '🌟新增品牌種類' : '✏️編輯品牌種類'"
      @closed="resetForm"
      width="50%"
    >
      <div class="title">品牌信息</div>
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="150px" label-position="left">
        <el-form-item prop="brandId" label="品牌名稱" style="width: 100%">
          <el-select
            v-model="formData.brandId"
            filterable
            remote
            :remote-method="fetchBrandOptions"
            :loading="loading"
            placeholder="請輸入"
            clearable
            remote-show-suffix
          >
            <el-option v-for="item in brandOptions" :key="item.brandName" :label="item.brandName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="brandTypeName" label="品牌種類名稱">
          <el-input v-model="formData.brandTypeName" placeholder="輸入品牌種類名稱" clearable />
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
