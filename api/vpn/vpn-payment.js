import request from '@/utils/request'

// 查询VpnPayment列表
export function listVpnPayment(query) {
    return request({
        url: '/api/v1/vpn-payment',
        method: 'get',
        params: query
    })
}

// 查询VpnPayment详细
export function getVpnPayment (id) {
    return request({
        url: '/api/v1/vpn-payment/' + id,
        method: 'get'
    })
}


// 新增VpnPayment
export function addVpnPayment(data) {
    return request({
        url: '/api/v1/vpn-payment',
        method: 'post',
        data: data
    })
}

// 修改VpnPayment
export function updateVpnPayment(data) {
    return request({
        url: '/api/v1/vpn-payment/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除VpnPayment
export function delVpnPayment(data) {
    return request({
        url: '/api/v1/vpn-payment',
        method: 'delete',
        data: data
    })
}

export function pay(data) {
    return request({
        url: '/api/v1/vpn-payment/pay',
        method: 'post',
        data: data
    })
}


export function getInfo(orderNo) {
    return request({
        url: `/api/v1/vpn-payment/detail?orderNo=${orderNo}`,
        method: 'get'
    })
}