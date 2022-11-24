
<template>
    <BasicLayout>
        <template #wrapper>
            <el-card class="box-card">
                <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
                    <el-form-item label="支付单号" prop="paymentNo">
                        <el-input v-model="queryParams.paymentNo" placeholder="请输入支付单号" clearable size="small"
                            @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="网关id" prop="gatewayId">
                        <el-input v-model="queryParams.gatewayId" placeholder="请输入网关id" clearable size="small"
                            @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="网关单号" prop="gatewayNo">
                        <el-input v-model="queryParams.gatewayNo" placeholder="请输入网关单号" clearable size="small"
                            @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="支付连接" prop="paymentUrl">
                        <el-input v-model="queryParams.paymentUrl" placeholder="请输入支付连接" clearable size="small"
                            @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="用户号" prop="userId">
                        <el-input v-model="queryParams.userId" placeholder="请输入用户号" clearable size="small"
                            @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="用户名称" prop="userName">
                        <el-input v-model="queryParams.userName" placeholder="请输入用户名称" clearable size="small"
                            @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="queryParams.status" placeholder="支付订单状态" clearable size="small">
                            <el-option v-for="dict in statusOptions" :key="dict.value" :label="dict.label"
                                :value="dict.value" />
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button v-permisaction="['vpn:vpnPayment:add']" type="primary" icon="el-icon-plus"
                            size="mini" @click="handleAdd">新增
                        </el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button v-permisaction="['vpn:vpnPayment:edit']" type="success" icon="el-icon-edit"
                            size="mini" :disabled="single" @click="handleUpdate">修改
                        </el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button v-permisaction="['vpn:vpnPayment:remove']" type="danger" icon="el-icon-delete"
                            size="mini" :disabled="multiple" @click="handleDelete">删除
                        </el-button>
                    </el-col>
                </el-row>

                <el-table v-loading="loading" :data="vpnPaymentList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column label="支付单号" align="center" prop="paymentNo" :show-overflow-tooltip="true" />
                    <el-table-column label="金额/分" align="center" prop="amount" :show-overflow-tooltip="true" />
                    <el-table-column label="网关id" align="center" prop="gatewayId" :show-overflow-tooltip="true" />
                    <el-table-column label="网关名称" align="center" prop="gatewayName" :show-overflow-tooltip="true" />
                    <el-table-column label="网关单号" align="center" prop="gatewayNo" :show-overflow-tooltip="true" />
                    <el-table-column label="支付连接" align="center" prop="paymentUrl" :show-overflow-tooltip="true" />
                    <el-table-column label="用户号" align="center" prop="userId" :show-overflow-tooltip="true" />
                    <el-table-column label="用户名称" align="center" prop="userName" :show-overflow-tooltip="true" />
                    <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" width="100">
                        <template slot-scope="scope">
                            {{ statusFormat(scope.row) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="确认时间" align="center" prop="confrmTime" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{ parseTime(scope.row.confrmTime) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                            <el-popconfirm class="delete-popconfirm" title="确认要修改吗?" confirm-button-text="修改"
                                @onConfirm="handleUpdate(scope.row)">
                                <el-button slot="reference" v-permisaction="['vpn:vpnPayment:edit']" size="mini"
                                    type="text" icon="el-icon-edit">修改
                                </el-button>
                            </el-popconfirm>
                            <el-popconfirm class="delete-popconfirm" title="确认要删除吗?" confirm-button-text="删除"
                                @onConfirm="handleDelete(scope.row)">
                                <el-button slot="reference" v-permisaction="['vpn:vpnPayment:remove']" size="mini"
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

                        <el-form-item label="支付单号" prop="paymentNo">
                            <el-input v-model="form.paymentNo" placeholder="支付单号" />
                        </el-form-item>
                        <el-form-item label="金额/分" prop="amount">
                            <el-input v-model="form.amount" placeholder="金额/分" />
                        </el-form-item>
                        <el-form-item label="网关id" prop="gatewayId">
                            <el-input v-model="form.gatewayId" placeholder="网关id" />
                        </el-form-item>
                        <el-form-item label="网关名称" prop="gatewayName">
                            <el-input v-model="form.gatewayName" placeholder="网关名称" />
                        </el-form-item>
                        <el-form-item label="网关单号" prop="gatewayNo">
                            <el-input v-model="form.gatewayNo" placeholder="网关单号" />
                        </el-form-item>
                        <el-form-item label="支付连接" prop="paymentUrl">
                            <el-input v-model="form.paymentUrl" placeholder="支付连接" />
                        </el-form-item>
                        <el-form-item label="用户号" prop="userId">
                            <el-input v-model="form.userId" placeholder="用户号" />
                        </el-form-item>
                        <el-form-item label="用户名称" prop="userName">
                            <el-input v-model="form.userName" placeholder="用户名称" />
                        </el-form-item>
                        <el-form-item label="额外数据" prop="extJson">
                            <el-input v-model="form.extJson" placeholder="额外数据" />
                        </el-form-item>
                        <el-form-item label="状态" prop="status">
                            <el-select v-model="form.status">
                                <el-option v-for="dict in statusOptions" :key="parseInt(dict.value)" :label="dict.label"
                                    :value="parseInt(dict.value)" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="确认时间" prop="confrmTime">
                            <el-date-picker v-model="form.confrmTime" type="datetime" placeholder="选择日期">
                            </el-date-picker>
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
import { addVpnPayment, delVpnPayment, getVpnPayment, listVpnPayment, updateVpnPayment } from '@/api/vpn/vpn-payment'

export default {
    name: 'VpnPayment',
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
            vpnPaymentList: [],
            statusOptions: [],
            // 关系表类型

            // 查询参数
            queryParams: {
                pageIndex: 1,
                pageSize: 10,
                paymentNo: undefined,
                gatewayId: undefined,
                gatewayNo: undefined,
                paymentUrl: undefined,
                userId: undefined,
                userName: undefined,
                status: undefined,

            },
            // 表单参数
            form: {
            },
            // 表单校验
            rules: {
                paymentNo: [{ required: true, message: '支付单号不能为空', trigger: 'blur' }],
                gatewayId: [{ required: true, message: '网关id不能为空', trigger: 'blur' }],
                gatewayNo: [{ required: true, message: '网关单号不能为空', trigger: 'blur' }],
                paymentUrl: [{ required: true, message: '支付连接不能为空', trigger: 'blur' }],
                userId: [{ required: true, message: '用户号不能为空', trigger: 'blur' }],
                userName: [{ required: true, message: '用户名称不能为空', trigger: 'blur' }],
                status: [{ required: true, message: '状态：vpn_payment_status不能为空', trigger: 'blur' }],
            }
        }
    },
    created() {
        this.getList()
        this.getDicts('vpn_payment_status').then(response => {
            this.statusOptions = response.data
        })
    },
    methods: {
        /** 查询参数列表 */
        getList() {
            this.loading = true
            listVpnPayment(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                this.vpnPaymentList = response.data.list
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
                paymentNo: undefined,
                amount: undefined,
                gatewayId: undefined,
                gatewayName: undefined,
                gatewayNo: undefined,
                paymentUrl: undefined,
                userId: undefined,
                userName: undefined,
                extJson: undefined,
                status: undefined,
                confrmTime: undefined,
            }
            this.resetForm('form')
        },
        getImgList: function () {
            this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
        },
        fileClose: function () {
            this.fileOpen = false
        },
        statusFormat(row) {
            return this.selectDictLabel(this.statusOptions, row.status)
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
            this.title = '添加支付订单'
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
            getVpnPayment(id).then(response => {
                this.form = response.data
                this.open = true
                this.title = '修改支付订单'
                this.isEdit = true
            })
        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    if (this.form.id !== undefined) {
                        updateVpnPayment(this.form).then(response => {
                            if (response.code === 200) {
                                this.msgSuccess(response.msg)
                                this.open = false
                                this.getList()
                            } else {
                                this.msgError(response.msg)
                            }
                        })
                    } else {
                        addVpnPayment(this.form).then(response => {
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
                return delVpnPayment({ 'ids': Ids })
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
