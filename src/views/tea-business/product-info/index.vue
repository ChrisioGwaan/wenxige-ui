<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import {
  batchDeleteTableRequestData,
  type CreateOrUpdateTableRequestData,
  type GetTableData
} from "@/api/table/types/table"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import {
  createProduct,
  getTableDataPage,
  getProductById,
  updateProduct,
  deleteProduct,
  batchDeleteProduct
} from "@/api/product"

defineOptions({
  name: "ElementPlus"
})

// #selection start
let multipleSelection = []
// #selection end
const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

// #region create
const DEFAULT_FORM_DATA: CreateOrUpdateTableRequestData = {
  id: undefined,
  brandTypeId: undefined,
  productName: "",
  specification: "",
  manufactureDate: "",
  hasSpecificDay: "",
  retailPrice: undefined,
  sellPrice: undefined,
  unitType: undefined,
  currentQuantity: undefined,
  comment: ""
}
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = ref<CreateOrUpdateTableRequestData>(JSON.parse(JSON.stringify(DEFAULT_FORM_DATA)))
const formRules: FormRules<CreateOrUpdateTableRequestData> = {
  brandTypeId: [{ required: true, trigger: "blur", message: "品牌不能為空！" }],
  productName: [{ required: true, trigger: "blur", message: "產品名稱不能為空！" }],
  specification: [{ required: true, trigger: "blur", message: "產品規格不能為空！" }],
  manufactureDate: [{ required: true, trigger: "blur", message: "製造日期不能為空！" }],
  retailPrice: [{ required: true, trigger: "blur", message: "全國統一零售價格不能為空！" }],
  sellPrice: [{ required: false, trigger: "blur", message: "銷售價格不能為空！" }],
  unitType: [{ required: true, trigger: "blur", message: "單位不能為空！" }],
  currentQuantity: [{ required: true, trigger: "blur", message: "現有貨存數不能為空！" }],
  comment: [{ required: false, trigger: "blur", message: "備註不能為空！" }]
}
const handleCreateOrUpdate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      loading.value = true
      const api = formData.value.id === undefined ? createProduct : updateProduct
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
const handleDelete = (row: Product) => {
  ElMessageBox.confirm(`你確定要刪除 ${row.productName} ?`, "產品刪除提示", {
    confirmButtonText: "確定",
    cancelButtonText: "再諗下",
    type: "warning"
  }).then(() => {
    deleteProduct(row.id).then(() => {
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
    const data: batchDeleteTableRequestData = { productIds: multipleSelection }
    batchDeleteProduct(data)
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
  getProductById(row.id)
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
  productName: "",
  dataRange: []
})
const getTableData = () => {
  loading.value = true
  getTableDataPage({
    current: paginationData.currentPage || 1,
    size: paginationData.pageSize || 10,
    productName: searchData.productName,
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
  searchData.productName = ""
  searchData.dataRange = []
  handleSearch()
}
// #endregion
const handleSelectionChange = (selection: GetTableData[]) => {
  multipleSelection = selection.map((item) => item.id)
  console.log(multipleSelection)
}

/** Watch if queries are different based on the page results */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="productName" label="產品名稱：" style="width: 260px">
          <el-input v-model="searchData.productName" placeholder="請輸入" clearable />
        </el-form-item>
        <el-form-item prop="createTime" label="創建時間：">
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
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增產品</el-button>
          <el-button type="danger" :icon="Delete" @click="handleBatchDelete">批量刪除產品</el-button>
        </div>
        <div>
          <el-tooltip content="導出Excel">
            <el-button type="primary" :icon="Download" circle />
          </el-tooltip>
          <el-tooltip content="刷新查詢頁">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData" v-loading="loading" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="45" />
          <el-table-column type="index" label="序号" width="80" align="center" />
          <el-table-column prop="productName" label="產品名稱" align="center" width="180" />
          <el-table-column
            prop="specification"
            label="產品規格"
            align="center"
            width="120"
            :show-overflow-tooltip="true"
          />
          <el-table-column prop="manufactureDateStr" label="製造日期" align="center" width="180" />
          <el-table-column prop="retailPrice" label="全國統一零售價" align="center" width="180" />
          <el-table-column prop="sellPrice" label="銷售價格" align="center" width="180" />
          <el-table-column prop="unitType" label="單位" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.unitType === 1" type="success" effect="plain">個</el-tag>
              <el-tag v-else type="info" effect="plain">其它</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="currentQuantity" label="現有貨存數量" align="center" width="180" />
          <el-table-column prop="createTime" label="創建時間" align="center" width="180" />
          <el-table-column prop="modifiedTime" label="更新時間" align="center" width="180" />
          <el-table-column fixed="right" label="操作" width="150" header-align="center" align="center">
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
      :title="formData.id === undefined ? '新增產品' : '編輯產品'"
      @closed="resetForm"
      width="50%"
    >
      <div class="title">產品信息</div>
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="180px" label-position="left">
        <el-form-item prop="productName" label="產品名稱">
          <el-input v-model="formData.productName" placeholder="輸入產品名稱" clearable />
        </el-form-item>
        <el-form-item prop="brandTypeId" label="品牌類型">
          <el-input v-model="formData.brandTypeId" placeholder="輸入品牌類型" clearable />
        </el-form-item>
        <el-form-item prop="specification" label="規格">
          <el-input v-model="formData.specification" placeholder="輸入規格" clearable />
        </el-form-item>
        <el-form-item prop="manufactureDate" label="製造日期">
          <el-date-picker
            v-model="formData.manufactureDate"
            type="month"
            placeholder="選擇製造日期"
            value-format="YYYY-MM-DD"
            clearable
          />
        </el-form-item>
        <el-form-item prop="hasSpecificDay" label="製造日期是否精確到天">
          <el-radio-group v-model="formData.hasSpecificDay" disabled>
            <el-radio aria-label="1" value="1">是</el-radio>
            <el-radio aria-label="0" value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="retailPrice" label="全國統一零售價">
          <el-input v-model="formData.retailPrice" placeholder="輸入全國統一零售價" clearable />
        </el-form-item>
        <el-form-item prop="sellPrice" label="銷售價格">
          <el-input v-model="formData.sellPrice" placeholder="輸入銷售價格" clearable />
        </el-form-item>
        <el-form-item prop="unitType" label="單位">
          <el-radio-group v-model="formData.unitType">
            <el-radio aria-label="1" :value="1">個</el-radio>
            <el-radio aria-label="2" :value="2">其它</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="currentQuantity" label="現有貨存數量">
          <el-input v-model="formData.currentQuantity" placeholder="輸入現有貨存數量" clearable />
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
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
