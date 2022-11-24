
<template>
    <BasicLayout>
        <template #wrapper>
            <el-card class="box-card">
                <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
                    <el-form-item label="服务器名称" prop="serverName">
                        <el-input v-model="queryParams.serverName" placeholder="请输入服务器名称" clearable size="small"
                            @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="queryParams.status" placeholder="服务器配置状态" clearable size="small">
                            <el-option v-for="dict in statusOptions" :key="parseInt(dict.value)" :label="dict.label"
                                :value="parseInt(dict.value)" />
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                        <el-button type="info" icon="el-icon-share" size="mini" @click="handleSubscribe(null)"
                            v-permisaction="['vpn:vpnServer:subscribe_address']">订阅</el-button>
                    </el-form-item>
                </el-form>

                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button v-permisaction="['vpn:vpnServer:add']" type="primary" icon="el-icon-plus" size="mini"
                            @click="handleAdd">新增
                        </el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button v-permisaction="['vpn:vpnServer:edit']" type="success" icon="el-icon-edit"
                            size="mini" :disabled="single" @click="handleUpdate">修改
                        </el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button v-permisaction="['vpn:vpnServer:remove']" type="danger" icon="el-icon-delete"
                            size="mini" :disabled="multiple" @click="handleDelete">删除
                        </el-button>
                    </el-col>
                </el-row>

                <el-table v-loading="loading" :data="vpnServerList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column label="服务器名称" align="center" prop="serverName" :show-overflow-tooltip="true" />
                    <el-table-column label="来源" align="center" prop="source" :formatter="sourceFormat" width="100">
                        <template slot-scope="scope">
                            {{ sourceFormat(scope.row) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="协议类型" align="center" prop="type" :formatter="typeFormat" width="100">
                        <template slot-scope="scope">
                            {{ typeFormat(scope.row) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="客户端域名" align="center" prop="clientDomain" :show-overflow-tooltip="true" />
                    <el-table-column label="客户端端口" align="center" prop="clientPort" :show-overflow-tooltip="true" />
                    <el-table-column label="标识" align="center" prop="inboundTag" :show-overflow-tooltip="true" />
                    <el-table-column label="等级" align="center" prop="grade" :show-overflow-tooltip="true" />
                    <el-table-column label="流量倍数" align="center" prop="multiple" :show-overflow-tooltip="true" />
                    <el-table-column label="协议" align="center" prop="protocol" :show-overflow-tooltip="true" />
                    <el-table-column label="是否ssl" align="center" prop="supporttls" :formatter="supporttlsFormat"
                        width="100">
                        <template slot-scope="scope">
                            {{ supporttlsFormat(scope.row) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="是否跳过证书" align="center" prop="allowInsecure" :formatter="allowInsecureFormat"
                        width="100">
                        <template slot-scope="scope">
                            {{ allowInsecureFormat(scope.row) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="v2ray ip" align="center" prop="v2rayIp" :show-overflow-tooltip="true" />
                    <el-table-column label="v2ray开放端口" align="center" prop="v2rayPort" :show-overflow-tooltip="true" />
                    <el-table-column label="v2ray管理端口" align="center" prop="v2rayManagerPort"
                        :show-overflow-tooltip="true" />
                    <el-table-column label="在线人数" align="center" prop="onlineNumber" :show-overflow-tooltip="true" />
                    <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" width="100">
                        <template slot-scope="scope">
                            {{ statusFormat(scope.row) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" min-width="150px" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                            <el-popconfirm class="delete-popconfirm" title="确认要修改吗?" confirm-button-text="修改"
                                @onConfirm="handleUpdate(scope.row)">
                                <el-button slot="reference" v-permisaction="['vpn:vpnServer:edit']" size="mini"
                                    type="text" icon="el-icon-edit">修改
                                </el-button>
                            </el-popconfirm>
                            <el-popconfirm class="delete-popconfirm" title="确认要删除吗?" confirm-button-text="删除"
                                @onConfirm="handleDelete(scope.row)">
                                <el-button slot="reference" v-permisaction="['vpn:vpnServer:remove']" size="mini"
                                    type="text" icon="el-icon-delete">删除
                                </el-button>
                            </el-popconfirm>

                            <el-popconfirm class="delete-popconfirm" title="是否获取二维码?" confirm-button-text="确认"
                                @onConfirm="handleSubscribe(scope.row)">
                                <el-button slot="reference" v-permisaction="['vpn:vpnServer:subscribe']" size="mini"
                                    type="text">二维码
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

                        <el-form-item label="服务器名称" prop="serverName">
                            <el-input v-model="form.serverName" placeholder="服务器名称" />
                        </el-form-item>
                        <el-form-item label="来源" prop="source">
                            <el-select v-model="form.source">
                                <el-option v-for="dict in serverSourceOptions" :key="parseInt(dict.value)"
                                    :label="dict.label" :value="parseInt(dict.value)" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="协议类型" prop="source">
                            <el-select v-model="form.type">
                                <el-option v-for="dict in serverTypeOptions" :key="dict.value" :label="dict.label"
                                    :value="dict.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="客户端域名" prop="clientDomain">
                            <el-input v-model="form.clientDomain" placeholder="客户端域名" />
                        </el-form-item>
                        <el-form-item label="客户端端口" prop="clientPort">
                            <el-input type="number" v-model.number="form.clientPort" placeholder="客户端端口" />
                        </el-form-item>
                        <el-form-item label="标识" prop="inboundTag">
                            <el-input v-model="form.inboundTag" placeholder="标识" />
                        </el-form-item>
                        <el-form-item label="等级" prop="grade">
                            <el-input type="number" v-model.number="form.grade" placeholder="等级" />
                        </el-form-item>
                        <el-form-item label="流量倍数" prop="multiple">
                            <el-input type="number" v-model.number="form.multiple" placeholder="" />
                        </el-form-item>
                        <el-form-item label="协议" prop="protocol">
                            <el-input v-model="form.protocol" placeholder="协议" />
                        </el-form-item>
                        <el-form-item label="是否ssl" prop="supporttls">
                            <el-select v-model="form.supporttls">
                                <el-option v-for="dict in isSslOptions" :key="parseInt(dict.value)" :label="dict.label"
                                    :value="parseInt(dict.value)" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="是否跳过证书" prop="allowInsecure">
                            <el-select v-model="form.allowInsecure">
                                <el-option v-for="dict in isSslOptions" :key="parseInt(dict.value)" :label="dict.label"
                                    :value="parseInt(dict.value)" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="v2ray ip" prop="v2rayIp">
                            <el-input v-model="form.v2rayIp" placeholder="v2ray ip" />
                        </el-form-item>
                        <el-form-item label="v2ray开放端口" prop="v2rayPort">
                            <el-input v-model.number="form.v2rayPort" placeholder="v2ray开放端口" />
                        </el-form-item>
                        <el-form-item label="v2ray管理端口" prop="v2rayManagerPort">
                            <el-input v-model.number="form.v2rayManagerPort" placeholder="v2ray管理端口" />
                        </el-form-item>
                        <el-form-item label="wsPath" prop="wsPath">
                            <el-input v-model="form.wsPath" placeholder="wsPath" />
                        </el-form-item>
                        <el-form-item label="在线人数" prop="onlineNumber">
                            <el-input type="number" v-model.number="form.onlineNumber" placeholder="在线人数" />
                        </el-form-item>
                        <el-form-item label="分享节点使用 的vmess链接" prop="vmess">
                            <el-input v-model="form.vmess" placeholder="分享节点使用 的vmess链接" @input="vmessInput" />
                        </el-form-item>
                        <el-form-item label="备注" prop="remark">
                            <el-input v-model="form.remark" placeholder="备注" />
                        </el-form-item>
                        <el-form-item label="状态" prop="status">
                            <el-select v-model="form.status">
                                <el-option v-for="dict in statusOptions" :key="parseInt(dict.value)" :label="dict.label"
                                    :value="parseInt(dict.value)" />
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="submitForm">确 定</el-button>
                        <el-button @click="cancel">取 消</el-button>
                    </div>
                </el-dialog>

                <el-dialog title="二维码" :visible.sync="qrOpen" width="400px">
                    <el-row justify="center" width="100%" class="center">
                        <el-col>
                            <vue-qr :text="qrCode" qid="qrcode" />
                        </el-col>
                    </el-row>
                    <el-row justify="center" width="100%" class="center">
                        <el-col>
                            <el-button type="primary" @click="copySubAddress">复制地址</el-button>
                        </el-col>
                    </el-row>
                </el-dialog>
            </el-card>
        </template>
    </BasicLayout>
</template>

<script>
import { addVpnServer, delVpnServer, getVpnServer, listVpnServer, updateVpnServer, getVpnServerQr, getSubAddress } from '@/api/vpn/vpn-server'
import VueQr from 'vue-qr'
export default {
    name: 'VpnServer',
    components: {
        VueQr
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
            vpnServerList: [],
            statusOptions: [],
            isSslOptions: [],
            allowInsecureOptions: [],
            serverSourceOptions: [],
            serverTypeOptions: [],
            // 关系表类型

            // 查询参数
            queryParams: {
                pageIndex: 1,
                pageSize: 10,
                serverName: undefined,
                status: undefined,

            },
            // 表单参数
            form: {
            },
            // 表单校验
            rules: {
                serverName: [{ required: true, message: '服务器名称不能为空', trigger: 'blur' }],
                status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
            },
            //额外
            qrCode: "",
            qrOpen: false
        }
    },
    created() {
        this.getDicts('vpn_server_status').then(response => {
            this.statusOptions = response.data
        })
        this.getDicts('vpn_server_ssl').then(response => {
            this.isSslOptions = response.data
        })
        this.getDicts('vpn_allow_insecure').then(res => {
            this.allowInsecureOptions = res.data
        })
        this.getDicts('vpn_server_source').then(res => {
            this.serverSourceOptions = res.data
        })
        this.getDicts('vpn_server_type').then(res => {
            this.serverTypeOptions = res.data
        })
        this.getList()

    },
    methods: {
        /** 查询参数列表 */
        getList() {
            this.loading = true
            listVpnServer(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                this.vpnServerList = response.data.list
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
                serverName: undefined,
                source: 0,
                clientDomain: '127.0.0.1',
                clientPort: 80,
                inboundTag: '6001',
                grade: 0,
                multiple: 1,
                protocol: undefined,
                supporttls: 0,
                allowInsecure: 1,
                v2rayIp: '127.0.0.1',
                v2rayPort: 6001,
                v2rayManagerPort: 62789,
                wsPath: '/ws/%s/',
                onlineNumber: 0,
                vmess: undefined,
                remark: undefined,
                status: 1,
            }
            this.resetForm('form')
        },
        getImgList: function () {
            this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
        },
        vmessInput(value) {
            if (!value) {
                return
            }

            try {
                let v2rayConfig = JSON.parse(atob(value.replace("vmess://", "")))
                console.log(v2rayConfig)
                this.form.clientDomain = v2rayConfig.add
                this.form.clientPort = parseInt(v2rayConfig.port)
                this.form.supporttls = v2rayConfig.tls == 'tls' ? 1 : 0
                this.form.serverName = v2rayConfig.ps
                this.form.allowInsecure = v2rayConfig['skip-cert-verify']
                this.form.wsPath = v2rayConfig.path

            } catch (err) {
                // alert('解析错误: 请使用vmess协议地址')
                alert(err.message)
            }
        },
        fileClose: function () {
            this.fileOpen = false
        },
        statusFormat(row) {
            return this.selectDictLabel(this.statusOptions, row.status)
        },

        supporttlsFormat(row) {
            return this.selectDictLabel(this.isSslOptions, row.supporttls)
        },
        allowInsecureFormat(row) {
            return this.selectDictLabel(this.allowInsecureOptions, row.allowInsecure)
        },
        sourceFormat(row) {
            return this.selectDictLabel(this.serverSourceOptions, row.source)
        },
        typeFormat(row) {
            return this.selectDictLabel(this.serverTypeOptions, row.type)
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
            this.title = '添加服务器配置'
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
            getVpnServer(id).then(response => {
                this.form = response.data
                this.open = true
                this.title = '修改服务器配置'
                this.isEdit = true
            })
        },
        copySubAddress() {
            var textarea = document.createElement('textarea');
            document.body.appendChild(textarea)
            textarea.style.position = 'absolute'
            textarea.style.clip = 'rect(0 0 0 0)'
            textarea.value = this.qrCode;
            textarea.select();
            document.execCommand('copy', true)
            this.$message("复制成功")
        },
        handleSubscribe(row) {
            var _this = this

            if (!row) {
                // 获取订阅地址
                getSubAddress().then(res => {
                    _this.qrOpen = true
                    _this.qrCode = res.data
                })
                return
            }

            if (row.source == 0) {
                getVpnServerQr(row.id).then(response => {
                    if (response.code == 200) {
                        _this.qrOpen = true

                        if (row.type == "vmess") {
                            console.log('vmess://' + btoa(JSON.stringify(response.data)))
                            _this.qrCode = 'vmess://' + btoa(JSON.stringify(response.data))
                        }

                        if (row.type == "trojan" || row.type == "trojan-go") {
                            console.log(`trojan://${encodeURIComponent(response.data.password)}@${response.data.host}:${response.data.port}`)
                            _this.qrCode = `trojan://${encodeURIComponent(response.data.password)}@${response.data.host}:${response.data.port}`
                        }
                    }

                })
            } else {
                _this.qrOpen = true
                _this.qrCode = row.vmess
            }

        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    if (this.form.id !== undefined) {
                        updateVpnServer(this.form).then(response => {
                            if (response.code === 200) {
                                this.msgSuccess(response.msg)
                                this.open = false
                                this.getList()
                            } else {
                                this.msgError(response.msg)
                            }
                        })
                    } else {
                        addVpnServer(this.form).then(response => {
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
                return delVpnServer({ 'ids': Ids })
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

<style scoped>
.center {
    text-align: center;
}
</style>
