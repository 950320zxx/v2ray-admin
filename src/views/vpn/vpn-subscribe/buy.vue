
<template>
    <BasicLayout>
        <template #wrapper>
            <!-- <el-card class="box-card"> -->

                <el-row justify="space-between" :gutter="20">
                    <el-col :md="10" :xl="5" v-for="item in vpnSubscribeList" :key="item.id">
                        <a class="block block-link-pop block-rounded m-3 mx-xl-0" href="javascript:void(0);">
                            <div class="block-header plan">
                                <h3 class="block-title">{{item.title}}</h3>
                            </div>
                            <div class="block-content bg-gray-light">
                                <div class="py-2">
                                    <p class="h1 mb-2">¥ {{item.amount / 100}}</p>
                                    <p class="h6 text-muted">{{item.subscribeName}}</p>
                                </div>
                            </div>
                            <div class="block-content py-3">
                                <div class="mb-3">
                                    <div style="text-align: left; margin-bottom: 8px; opacity: 1; display: flex; align-items: center;" v-for="(it, index) in item.trait" :key="index" ><i
                                            :class="it.support? 'el-icon-check si-check':'el-icon-close si-check'"
                                            style="font-size: 18px; vertical-align: sub;"></i><span
                                            style="padding-left: 8px;">{{it.title}}</span></div>
                                </div><button type="button" class="btn btn-sm btn-alt-primary" @click="handlerBuy(item)">立即订阅</button>
                            </div>
                        </a>
                    </el-col>
                </el-row>
            <!-- </el-card> -->

            <!-- 支付弹框 -->
            <el-dialog title="支付" :visible.sync="payVisible" width="300px">
                <el-form :model="form">
                    <el-form-item label="支付方式" label-width="100px">
                    <el-select v-model="pay.id" placeholder="请支付方式">
                        <el-option :label="item.name" :value="item.id" v-for="item in gateways" :key="item.id"></el-option>
                    </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="()=>{payVisible = false}">取 消</el-button>
                    <el-button type="primary" @click="toPay()">确 定</el-button>
                </div>
            </el-dialog>
        </template>
    </BasicLayout>
</template>

<script>
import { listVpnSubscribe } from '@/api/vpn/vpn-subscribe'
import { listAllGateway } from '@/api/vpn/vpn-gateway'
import {pay} from '@/api/vpn/vpn-payment'

export default {
    name: 'VpnBuySubscribe',
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
            gateways:[],
            payVisible:false,
            product:{

            },
            pay:{
                id:null,
                name:null
            }
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
                response.data.list.map(item=>{
                    item['trait'] = JSON.parse(item.content)
                })
                this.vpnSubscribeList = response.data.list
                this.total = response.data.count
                this.loading = false
            }
            )
        },
        async handlerBuy(item){
            console.log(item)
            this.product = item
            var res = await listAllGateway({})
            this.gateways = res.data
            // 弹出支付界面
            this.payVisible = true
        },
        toPay(){

            var _this =this
            _this.payVisible = false

            if(_this.pay.id == undefined || _this.pay.id == null){
                _this.$message("请选择支付方式")
                return
            }

            var gateway = this.gateways.find(item=>{
                return item.id = _this.pay.id
            })

            var data = {
                amount:this.product.amount,
                gatewayId:gateway.id,
                gatewayName:gateway.name,
                extJson:JSON.stringify(this.product)
            }
            pay(data).then(res=>{
                console.log(res)
                if(res.code == 200){
                    console.log("跳转链接：", res.data)
                    window.location.href = res.data
                }else{
                    _this.$message(res.msg)
                }
            })
            // console.log(data)
        }
    }
}
</script>

<style scoped>
.basic-layout {
    /* padding: 20px; */
    width: 100%;
    margin: 0 auto;
    padding: 1.75rem 1.75rem 1px;
    overflow-x: visible;

}

a.block {
    display: block;
    color: #495057;
    font-weight: 400;
    transition: transform .15s ease-out,opacity .15s ease-out,box-shadow .15s ease-out;
    padding-bottom: 1.75rem;
}

.block {
    margin-bottom: 1.75rem;
    background-color: #fff;
    box-shadow: 0 1px 3px rgb(219 226 239 / 50%), 0 1px 2px rgb(219 226 239 / 50%);
}

.block-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1.25rem;
    transition: opacity .25s ease-out;
}

.block-content {
    transition: opacity .25s ease-out;
    width: 100%;
    margin: 0 auto;
    padding: 1.25rem 1.25rem 1px;
    overflow-x: visible;
}

.bg-gray-light {
    background-color: #e9ecef!important;
}

.si-check {
    border: 1px solid #0665d0;
    border-radius:50%;
    color: #0665d0!important;
}

.mb-3, .my-3 {
    margin-bottom: 1rem!important;
}

.btn {
    border: 0;
    font-weight: 600;
}
.btn-alt-primary {
    color: #054d9e;
    background-color: #cde4fe;
    border-color: #cde4fe;
}

.btn {
    font-family: Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,Liberation Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
}
.btn-group-sm>.btn, .btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: .875rem;
    line-height: 1.5;
    border-radius: 0.2rem;
}
</style>
