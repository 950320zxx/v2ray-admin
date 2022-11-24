
<template>
    <BasicLayout>
        <template #wrapper>
            <el-card class="box-card">
                <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
                    <el-form-item label="订阅名称" prop="subscribeName">
                        <el-input v-model="queryParams.subscribeName" placeholder="请输入订阅名称" clearable size="small"
                            @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="queryParams.title" placeholder="请输入标题" clearable size="small"
                            @keyup.enter.native="handleQuery" />
                    </el-form-item>

                    <el-form-item label="周期" prop="cycle">
                        <el-select v-model="queryParams.cycle" placeholder="周期" clearable size="small">
                            <el-option v-for="dict in cycleOptions" :key="parseInt(dict.value)" :label="dict.label"
                                :value="parseInt(dict.value)" />
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button v-permisaction="['vpn:vpnSubscribe:add']" type="primary" icon="el-icon-plus"
                            size="mini" @click="handleAdd">新增
                        </el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button v-permisaction="['vpn:vpnSubscribe:edit']" type="success" icon="el-icon-edit"
                            size="mini" :disabled="single" @click="handleUpdate">修改
                        </el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button v-permisaction="['vpn:vpnSubscribe:remove']" type="danger" icon="el-icon-delete"
                            size="mini" :disabled="multiple" @click="handleDelete">删除
                        </el-button>
                    </el-col>
                </el-row>

                <el-table v-loading="loading" :data="vpnSubscribeList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column label="订阅名称" align="center" prop="subscribeName" :show-overflow-tooltip="true" />
                    <el-table-column label="标题" align="center" prop="title" :show-overflow-tooltip="true" />
                    <el-table-column label="价格/ 分" align="center" prop="amount" :show-overflow-tooltip="true" />
                    <el-table-column label="流量/G" align="center" prop="flowLimit" :show-overflow-tooltip="true" >
                        <template slot-scope="scope">
                            {{ scope.row.flowLimit / G }}
                        </template>
                    </el-table-column>
                    <el-table-column label="速率/M" align="center" prop="flowSpeed" :show-overflow-tooltip="true" >
                        <template slot-scope="scope">
                            {{ scope.row.flowSpeed / M }}
                        </template>
                    </el-table-column>
                    <el-table-column label="周期" align="center" prop="cycle" :formatter="cycleFormat" width="100">
                        <template slot-scope="scope">
                            {{ cycleFormat(scope.row) }}
                        </template>
                    </el-table-column>

                    <!-- <el-table-column label="内容" align="center" prop="content" :show-overflow-tooltip="true" /> -->
                    <el-table-column label="重置周期/月" align="center" prop="reset" :show-overflow-tooltip="true" />
                    <el-table-column label="排序" align="center" prop="sort" :show-overflow-tooltip="true" />
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                            <el-popconfirm class="delete-popconfirm" title="确认要修改吗?" confirm-button-text="修改"
                                @onConfirm="handleUpdate(scope.row)">
                                <el-button slot="reference" v-permisaction="['vpn:vpnSubscribe:edit']" size="mini"
                                    type="text" icon="el-icon-edit">修改
                                </el-button>
                            </el-popconfirm>
                            <el-popconfirm class="delete-popconfirm" title="确认要删除吗?" confirm-button-text="删除"
                                @onConfirm="handleDelete(scope.row)">
                                <el-button slot="reference" v-permisaction="['vpn:vpnSubscribe:remove']" size="mini"
                                    type="text" icon="el-icon-delete">删除
                                </el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>

                <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageIndex"
                    :limit.sync="queryParams.pageSize" @pagination="getList" />

                <!-- 添加或修改对话框 -->
                <el-dialog :title="title" :visible.sync="open" width="500px">
                    <el-form ref="form" :model="form" :rules="rules" label-width="80px">

                        <el-form-item label="订阅名称" prop="subscribeName">
                            <el-input v-model="form.subscribeName" placeholder="订阅名称" />
                        </el-form-item>
                        <el-form-item label="标题" prop="title">
                            <el-input v-model="form.title" placeholder="标题" />
                        </el-form-item>
                        <el-form-item label="价格/ 分" prop="amount">
                            <el-input type="number" v-model.number="form.amount" placeholder="价格/ 分" />
                        </el-form-item>
                        <!-- <el-form-item label="流量/G" prop="flowLimit">
                            <el-input type="number" v-model.number="form.flowLimit" placeholder="流量/G" />
                        </el-form-item>
                        <el-form-item label="速率/M" prop="flowSpeed">
                            <el-input type="number" v-model.number="form.flowSpeed" placeholder="速率/M" />
                        </el-form-item> -->

                        <el-form-item label="流量/G" prop="flowLimit">
                            <el-input type="number" v-model.number="flowLimitTemp" placeholder="流量/G" />
                        </el-form-item>
                        <el-form-item label="速率/M" prop="flowSpeed">
                            <el-input type="number" v-model.number="flowSpeedTemp" placeholder="速率/M" />
                        </el-form-item>
                        <el-form-item label="周期" prop="cycle">
                            <el-select v-model="form.cycle">
                                <el-option v-for="dict in cycleOptions" :key="parseInt(dict.value)" :label="dict.label"
                                    :value="parseInt(dict.value)" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="内容" prop="content">
                            <el-input v-model="form.content" placeholder="内容" />
                        </el-form-item>
                        <el-form-item label="重置周期/月" prop="reset">
                            <el-input type="number" v-model.number="form.reset" placeholder="重置周期/月" />
                        </el-form-item>
                        <el-form-item label="排序" prop="sort">
                            <el-input type="number" v-model.number="form.sort" placeholder="排序" />
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="submitForm">确 定</el-button>
                        <el-button @click="cancel">取 消</el-button>
                    </div>
                </el-dialog>
            </el-card>
        </template>
    </BasicLayout>
</template>

<script>
import { addVpnSubscribe, delVpnSubscribe, getVpnSubscribe, listVpnSubscribe, updateVpnSubscribe } from '@/api/vpn/vpn-subscribe'

export default {
    name: 'VpnSubscribe',
    components: {
    },
    data() {
        return {
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 总条数
            total: 0,
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            isEdit: false,
            // 类型数据字典
            typeOptions: [],
            vpnSubscribeList: [],
            cycleOptions: [],

            // 关系表类型

            // 查询参数
            queryParams: {
                pageIndex: 1,
                pageSize: 10,
                subscribeName: undefined,
                title: undefined,
                cycle: undefined,

            },
            // 表单参数
            form: {
            },
            // 表单校验
            rules: {
                subscribeName: [{ required: true, message: '订阅名称不能为空', trigger: 'blur' }],
                title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
                cycle: [{ required: true, message: '周期不能为空', trigger: 'blur' }],
            },
            flowLimitTemp: 1,
            flowSpeedTemp: 1,
            M: 1021 * 1024 * 1024, // 1M
            G: 1021 * 1024 * 1024 * 1024, // G
        }
    },
    created() {
        this.getList()
        this.getDicts('vpn_cycle').then(response => {
            this.cycleOptions = response.data
        })
    },
    methods: {
        /** 查询参数列表 */
        getList() {
            this.loading = true
            listVpnSubscribe(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                this.vpnSubscribeList = response.data.list
                this.total = response.data.count
                this.loading = false
            }
            )
        },
        // 取消按钮
        cancel() {
            this.open = false
            this.reset()
        },
        // 表单重置
        reset() {
            this.form = {

                id: undefined,
                subscribeName: undefined,
                title: undefined,
                amount: undefined,
                flowLimit: undefined,
                cycle: undefined,
                content: undefined,
                reset: undefined,
                sort: undefined,
            }
            this.resetForm('form')
        },
        getImgList: function () {
            this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
        },
        fileClose: function () {
            this.fileOpen = false
        },
        cycleFormat(row) {
            return this.selectDictLabel(this.cycleOptions, row.cycle)
        },
        // 关系
        // 文件
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageIndex = 1
            this.getList()
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.dateRange = []
            this.resetForm('queryForm')
            this.handleQuery()
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset()
            this.open = true
            this.title = '添加订阅'
            this.isEdit = false
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id)
            this.single = selection.length !== 1
            this.multiple = !selection.length
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset()
            const id =
                row.id || this.ids
            getVpnSubscribe(id).then(response => {
                this.form = response.data
                this.flowLimitTemp = this.form.flowLimit / this.G
                this.flowSpeedTemp = this.form.flowSpeed / this.M
                this.open = true
                this.title = '修改订阅'
                this.isEdit = true
            })
        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    if (this.form.id !== undefined) {
                        this.form.flowLimit = this.flowLimitTemp * this.G
                        this.form.flowSpeed = this.flowSpeedTemp * this.M

                        updateVpnSubscribe(this.form).then(response => {
                            if (response.code === 200) {
                                this.msgSuccess(response.msg)
                                this.open = false
                                this.getList()
                            } else {
                                this.msgError(response.msg)
                            }
                        })
                    } else {
                        addVpnSubscribe(this.form).then(response => {
                            if (response.code === 200) {
                                this.msgSuccess(response.msg)
                                this.open = false
                                this.getList()
                            } else {
                                this.msgError(response.msg)
                            }
                        })
                    }
                }
            })
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            var Ids = (row.id && [row.id]) || this.ids

            this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function () {
                return delVpnSubscribe({ 'ids': Ids })
            }).then((response) => {
                if (response.code === 200) {
                    this.msgSuccess(response.msg)
                    this.open = false
                    this.getList()
                } else {
                    this.msgError(response.msg)
                }
            }).catch(function () {
            })
        }
    }
}
</script>
