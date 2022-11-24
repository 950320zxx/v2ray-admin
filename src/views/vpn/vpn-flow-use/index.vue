
<template>
    <BasicLayout>
        <template #wrapper>
            <el-card class="box-card">
                <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
                    <el-form-item label="用户名" prop="userName">
                        <el-input v-model="queryParams.userName" placeholder="请输入用户名" clearable size="small"
                            @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="token 唯一值" prop="token">
                        <el-input v-model="queryParams.token" placeholder="请输入token 唯一值" clearable size="small"
                            @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="queryParams.status" placeholder="用户流量使用状态" clearable size="small">
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
                        <el-button v-permisaction="['vpn:vpnFlowUse:add']" type="primary" icon="el-icon-plus"
                            size="mini" @click="handleAdd">新增
                        </el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button v-permisaction="['vpn:vpnFlowUse:edit']" type="success" icon="el-icon-edit"
                            size="mini" :disabled="single" @click="handleUpdate">修改
                        </el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button v-permisaction="['vpn:vpnFlowUse:remove']" type="danger" icon="el-icon-delete"
                            size="mini" :disabled="multiple" @click="handleDelete">删除
                        </el-button>
                    </el-col>
                </el-row>

                <el-table v-loading="loading" :data="vpnFlowUseList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column label="用户名" align="center" prop="userName" :show-overflow-tooltip="true" />
                    <el-table-column label="uuid" align="center" prop="uuid" :show-overflow-tooltip="true" />
                    <el-table-column label="token 唯一值" align="center" prop="token" :show-overflow-tooltip="true" />
                    <el-table-column label="流量额度/G" align="center" prop="flowLimit" :show-overflow-tooltip="true" >
                        <template slot-scope="scope">
                            <span>{{ parseInt(scope.row.flowLimit/ G) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="已使用流量/M" align="center" prop="useFlow" :show-overflow-tooltip="true" >
                        <template slot-scope="scope">
                            <span>{{ parseFloat(scope.row.useFlow/ M) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="流量速率/M" align="center" prop="flowSpeed" :show-overflow-tooltip="true" >
                        <template slot-scope="scope">
                            <span>{{ parseInt(scope.row.flowSpeed/ M) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="到期时间" align="center" prop="toTime" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{ parseTime(scope.row.toTime) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" width="100">
                        <template slot-scope="scope">
                            {{ statusFormat(scope.row) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                            <el-popconfirm class="delete-popconfirm" title="确认要修改吗?" confirm-button-text="修改"
                                @onConfirm="handleUpdate(scope.row)">
                                <el-button slot="reference" v-permisaction="['vpn:vpnFlowUse:edit']" size="mini"
                                    type="text" icon="el-icon-edit">修改
                                </el-button>
                            </el-popconfirm>
                            <el-popconfirm class="delete-popconfirm" title="确认要删除吗?" confirm-button-text="删除"
                                @onConfirm="handleDelete(scope.row)">
                                <el-button slot="reference" v-permisaction="['vpn:vpnFlowUse:remove']" size="mini"
                                    type="text" icon="el-icon-delete">删除
                                </el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>

                <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageIndex"
                    :limit.sync="queryParams.pageSize" @pagination="getList" />

                <!-- 添加或修改对话框 -->
                <el-dialog :title="title" :visible.sync="open" width="800px">
                    <el-form ref="form" :model="form" :rules="rules" label-width="120px">

                        <el-form-item label="用户id" prop="userId">
                            <el-input type="number" v-model.number="form.userId" placeholder="用户id" />
                        </el-form-item>
                        <el-form-item label="用户名" prop="userName">
                            <el-input v-model="form.userName" placeholder="用户名" />
                        </el-form-item>
                        <el-form-item label="uuid" prop="uuid">
                            <el-input v-model="form.uuid" placeholder="uuid" />
                        </el-form-item>
                        <el-form-item label="token 唯一值" prop="token">
                            <el-input v-model="form.token" placeholder="token 唯一值" />
                        </el-form-item>
                        <!-- <el-form-item label="流量额度" prop="flowLimit">
                                        <el-input type="number" v-model.number="form.flowLimit" placeholder="流量额度"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="已使用流量" prop="useFlow">
                                        <el-input type="number" v-model.number="form.useFlow" placeholder="已使用流量"
                                                      />
                                                                              <el-form-item label="流量速率" prop="flowSpeed">
                            <el-input type="number" v-model.number="form.flowSpeed" placeholder="流量速率" />
                        </el-form-item>
                                    </el-form-item> -->

                        <el-form-item label="流量额度/G" prop="flowLimit">
                            <el-input type="number" v-model="flowLimitTemp" placeholder="流量额度" />
                        </el-form-item>
                        <el-form-item label="已使用流量/M" prop="useFlow">
                            <el-input type="number" v-model.number="useFlowTemp" placeholder="已使用流量" />
                        </el-form-item>
                        <el-form-item label="流量速率/M" prop="flowSpeed">
                            <el-input type="number" v-model.number="flowSpeedTemp" placeholder="流量速率" />
                        </el-form-item>

                        <el-form-item label="到期时间" prop="toTime">
                            <el-date-picker v-model="form.toTime" type="datetime" placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="状态" prop="status">
                            <el-select v-model="form.status">
                                <el-option v-for="dict in statusOptions" :key="parseInt(dict.value)" :label="dict.label"
                                    :value="dict.value" />
                            </el-select>
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
import { addVpnFlowUse, delVpnFlowUse, getVpnFlowUse, listVpnFlowUse, updateVpnFlowUse } from '@/api/vpn/vpn-flow-use'

export default {
    name: 'VpnFlowUse',
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
            vpnFlowUseList: [],
            statusOptions: [],
            // 关系表类型

            // 查询参数
            queryParams: {
                pageIndex: 1,
                pageSize: 10,
                userName: undefined,
                token: undefined,
                status: undefined,

            },
            // 表单参数
            form: {
            },
            // 表单校验
            rules: {
                userName: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
                token: [{ required: true, message: 'token 唯一值不能为空', trigger: 'blur' }],
                status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
            },
            M: 1021 * 1024 * 1024, // 1M
            G: 1021 * 1024 * 1024 * 1024, // G
            flowLimitTemp: 1,
            useFlowTemp: 1,
            flowSpeedTemp: 1
        }
    },
    created() {
        this.getList()
        this.getDicts('vpn_server_status').then(response => {
            this.statusOptions = response.data
        })
    },
    methods: {
        /** 查询参数列表 */
        getList() {
            this.loading = true
            listVpnFlowUse(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                this.vpnFlowUseList = response.data.list
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
                userId: undefined,
                userName: undefined,
                uuid: undefined,
                token: undefined,
                flowLimit: 0,
                useFlow: 0,
                flowSpeed: 0,
                toTime: undefined,
                status: undefined,
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
            this.title = '添加用户流量使用'
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
            getVpnFlowUse(id).then(response => {
                this.form = response.data
                // 计算
                this.flowLimitTemp = parseInt(this.form.flowLimit / this.G)
                this.useFlowTemp = parseFloat(this.form.useFlow / this.M)
                this.flowSpeedTemp = parseInt(this.form.flowSpeed / this.M)
                this.open = true
                this.title = '修改用户流量使用'
                this.isEdit = true
            })
        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    if (this.form.id !== undefined) {
                        this.form.flowLimit = this.flowLimitTemp * this.G
                        this.form.useFlow = this.useFlowTemp * this.M
                        this.form.flowSpeed = this.flowSpeedTemp * this.M

                        updateVpnFlowUse(this.form).then(response => {
                            if (response.code === 200) {
                                this.msgSuccess(response.msg)
                                this.open = false
                                this.getList()
                            } else {
                                this.msgError(response.msg)
                            }
                        })
                    } else {
                        console.log(this.form)
                        addVpnFlowUse(this.form).then(response => {
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
                return delVpnFlowUse({ 'ids': Ids })
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
