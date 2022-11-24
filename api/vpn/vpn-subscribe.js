import request from '@/utils/request'

// 查询VpnSubscribe列表
export function listVpnSubscribe(query) {
    return request({
        url: '/api/v1/vpn-subscribe',
        method: 'get',
        params: query
    })
}

// 查询VpnSubscribe详细
export function getVpnSubscribe (id) {
    return request({
        url: '/api/v1/vpn-subscribe/' + id,
        method: 'get'
    })
}


// 新增VpnSubscribe
export function addVpnSubscribe(data) {
    return request({
        url: '/api/v1/vpn-subscribe',
        method: 'post',
        data: data
    })
}

// 修改VpnSubscribe
export function updateVpnSubscribe(data) {
    return request({
        url: '/api/v1/vpn-subscribe/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除VpnSubscribe
export function delVpnSubscribe(data) {
    return request({
        url: '/api/v1/vpn-subscribe',
        method: 'delete',
        data: data
    })
}

