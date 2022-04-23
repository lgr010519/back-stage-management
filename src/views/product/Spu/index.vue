<template>
  <div>
    <el-card>
      <CategorySelect @getCategoryId="getCategoryId" :isShowTable="scene==0" />
    </el-card>
    <el-card style="margin:20px 0">
      <!-- 底部这里将来有三部分进行切换 -->
      <div v-show="scene==0">
        <!-- 展示SPU列表的结构 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <el-table style="width: 100%;margin:20px 0" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="spu描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <hint-button type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)"></hint-button>
              <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)"></hint-button>
              <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表" @click="handler(row)"></hint-button>
              <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
                <el-table :data="skuList" style="width:100%" border v-loading="loading">
                  <el-table-column property="skuName" label="名称" width="width"></el-table-column>
                  <el-table-column property="price" label="价格" width="width"></el-table-column>
                  <el-table-column property="weight" label="重量" width="width"></el-table-column>
                  <el-table-column label="默认图片" width="width">
                    <template slot-scope="{row,$index}">
                      <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px">
                    </template>
                  </el-table-column>
                </el-table>
              </el-dialog>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                <hint-button type="danger" icon="el-icon-delete" size="mini" title="删除spu" slot="reference"></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination :current-page="page" :page-sizes="[3, 5, 10]" :page-size="limit" layout="prev, pager, next, jumper,->,sizes,total" :total="total" style="text-align:center" @current-change="getSpuList" @size-change="handleSizeChange">
        </el-pagination>
      </div>
      <SpuForm v-show="scene==1" @changeScene="changeScene" ref="spu" />
      <SkuForm v-show="scene==2" @changeScenes="changeScenes" ref="sku" />
    </el-card>
  </div>
</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
export default {
  name: 'Spu',
  components: {
    SpuForm,
    SkuForm
  },
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      page: 1,
      limit: 3,
      records: [],
      total: 0,
      scene: 0,
      dialogTableVisible: false,
      spu: {},
      skuList: [],
      loading: true
    }
  },
  methods: {
    // 三级联动的自定义事件，把子组件相应id传给父组件
    getCategoryId({
      categoryId,
      level
    }) {
      if (level == 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level == 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        // 代表三级分类id有了
        this.category3Id = categoryId
        // 发请求获取SPU列表数据
        this.getSpuList()
      }
    },
    // 获取SPU列表数据的方法
    async getSpuList(pages = 1) {
      this.page = pages
      const {
        page,
        limit,
        category3Id
      } = this
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id)
      if (result.code == 200) {
        this.total = result.data.total
        this.records = result.data.records
      }
    },
    // 点击分页器第几页按钮的回调
    // handleCurrentChange(page) {
    //   this.page = page
    //   this.getSpuList()
    // }
    // 分页器每一页展示数据条数发生变化
    handleSizeChange(limit) {
      this.limit = limit
      this.getSpuList()
    },
    // 添加spu按钮回调
    addSpu() {
      this.scene = 1
      // 通知子组件发请求---两个
      this.$refs.spu.addSpuData(this.category3Id)
    },
    // 修改某一个spu
    updateSpu(row) {
      this.scene = 1
      //获取子组件SpuForm子组件的
      //在父组件当中可以通过$ref获取子组件等等
      this.$refs.spu.initSpuData(row)
    },
    changeScene({
      scene,
      flag
    }) {
      // 切换场景
      this.scene = scene
      // 需要再次获取SPU列表的数据进行展示
      if (flag == '修改') {
        this.getSpuList(this.page)
      } else {
        this.getSpuList()
      }
    },
    // 删除SPU的回调
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id)
      if (result.code == 200) {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1)
      }
    },
    // 添加SKU按钮的回调
    addSku(row) {
      this.scene = 2
      //父组件调用子组件的方法，让子组件发请求------三个请求
      this.$refs.sku.getData(this.category1Id, this.category2Id, row)
    },
    changeScenes(scene) {
      this.scene = scene
    },
    // 查看SKU的按钮回调
    async handler(spu) {
      this.dialogTableVisible = true
      this.spu = spu
      // 获取sku列表的数据进行展示
      let result = await this.$API.spu.reqSkuList(spu.id)
      if (result.code == 200) {
        this.skuList = result.data
        this.loading = false
      }
    },
    // 关闭对话框的回调
    close(done) {
      this.loading = true
      this.skuList = []
      done()
    }
  },
}
</script>

<style>

</style>
