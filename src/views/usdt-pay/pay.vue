<template>
  <div class="container">
    <div class="container_body">
      <div class="address_container">
        <div>transaction address</div>
        <div class="address">
          {{ payForm.transactionAddress }}
        </div>
      </div>

      <div class="amount_container">
        <div class="usdt">USDT</div>
        <div class="amount">
          {{ payForm.amount / 100 }}
        </div>
      </div>

      <div class="order_no">
        {{ payForm.orderNo }}
      </div>

      <div class="btn_container">
        <div class="btn" @click="handlerTransfer">Next</div>
      </div>
    </div>
  </div>
</template>

<script>
import {getInfo} from '@/api/vpn/vpn-payment'
import {usdtTransfer} from '@/api/vpn/vpn-usdt'
export default {
  name: 'USDT-Pay',
  components: {
  },
  data() {
    return {
      payForm: {
        transactionAddress: '',
        amount: 0,
        orderNo: "",
        transactionHash:"12234548787" //交易hash
      }
    };
  },
  created(){
    var orderNo =  this.$route.query.order_no
    this.payForm.orderNo = orderNo
    this.getOrder()
    this.getAddress()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getOrder(){
      var _this = this
      getInfo(_this.payForm.orderNo).then(res=>{
        if(res.code == 200){
          _this.payForm.amount = res.data.amount
        }else{
          _this.$message("订单不存在！")
        }

      })
    },
    getAddress(){
      var _this = this
      _this.$store.dispatch('system/settingDetail').then(res=>{
        _this.payForm.transactionAddress = res.vpn_usdt_address
      })
    },
    async handlerTransfer(){
      let _this = this
      //TODO usdt 转账
      var USDT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
      var tronWeb = null;

      //获取账号信息
        if (window.tronWeb && window.tronWeb.defaultAddress && window.tronWeb.defaultAddress.base58) {
          tronWeb = window.tronWeb;
        }else{
          _this.$message("请用TRX钱包打开交易")
          return
        }

        try{
          let instance = await tronWeb.contract().at(USDT);
        await instance.transfer(
              _this.payForm.transactionAddress, //address _to
              _this.payForm.amount * 10000   //amount
          ).send({
              feeLimit: 100000000
          }).then(txHash =>{
            _this.payForm.transactionHash = txHash
            _this.transfer()
          })
        }catch(e){
          this.$message(`交易失败：${e.message}`)
        }

    },
    transfer(){
      usdtTransfer(this.payForm).then(res=>{
        if(res.code == 200){
          this.$message("交易成功")
        }
      })
    }
  }
}
</script>


<style scoped>
#app {
  background-color: #fff;
  padding: 0;
}


@media screen and (max-width: 480px) {

  /* 手机端css */
  .container {
    width: 100%;
    height: 100%;
    text-align: center;
    background-color: #f9fbf96b;
  }
}

@media screen and (min-width: 481px) {

  /* PC端css */
  .container {
    min-width: 320px;
    max-width: 750px;
    height: 100%;
    text-align: center;
    background-color: #f9fbf96b;
    margin: 0 auto;
  }
}

.container {
  padding-top: 15%;
  font-size: 20px;
  text-align: left;
}

.container_body {
  width: 90%;
  height: 100%;
  margin: 0 auto;
  position: relative;
}

.address {
  margin-top: 15px;
  font-size: 15px;
  background-color: #fff;
  padding: 15px;
  border-radius: 10px;
}


.amount_container {
  margin-top: 15%;
}

.usdt {
  color: rgb(100, 88, 88);
}

.amount {
  margin-top: 15px;
  font-size: 35px;
  background-color: #fff;
  padding: 35px;
  border-radius: 10px;
}

.order_no {
  margin-top: 15px;
  padding: 15px;
  background-color: #fff;
  border-radius: 10px;
}


.btn_container {
  position: absolute;
  bottom: 25px;
  width: 100%;
}

.btn {
  background-color: rgb(48, 101, 180);
  padding: 18px;
  margin: 0 auto;
  font-size: 26px;
  border-radius: 10px;
  text-align: center;
  color: #fff;
}
</style>