import request from '@/utils/request'

// 查询VpnServer列表
export function listVpnServer(query) {
    return request({
        url: '/api/v1/vpn-server',
        method: 'get',
        params: query
    })
}

// 查询VpnServer详细
export function getVpnServer (id) {
    return request({
        url: '/api/v1/vpn-server/' + id,
        method: 'get'
    })
}

// 查询VpnServer详细
export function getVpnServerQr (id) {
    return request({
        url: '/api/v1/vpn-server/qr/' + id,
        method: 'get'
    })
}

// 获取订阅地址
export function getSubAddress () {
    return request({
        url: '/api/v1/vpn-server/sub_address',
        method: 'get'
    })
}

// 新增VpnServer
export function addVpnServer(data) {
    return request({
        url: '/api/v1/vpn-server',
        method: 'post',
        data: data
    })
}

// 修改VpnServer
export function updateVpnServer(data) {
    return request({
        url: '/api/v1/vpn-server/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除VpnServer
export function delVpnServer(data) {
    return request({
        url: '/api/v1/vpn-server',
        method: 'delete',
        data: data
    })
}

