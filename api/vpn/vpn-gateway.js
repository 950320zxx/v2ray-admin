import request from '@/utils/request'


// 查询VpnGateway列表
export function listAllGateway(query) {
    return request({
        url: '/api/v1/vpn-gateway/listAll',
        method: 'get',
        params: query
    })
}

// 查询VpnGateway列表
export function listVpnGateway(query) {
    return request({
        url: '/api/v1/vpn-gateway',
        method: 'get',
        params: query
    })
}

// 查询VpnGateway详细
export function getVpnGateway (id) {
    return request({
        url: '/api/v1/vpn-gateway/' + id,
        method: 'get'
    })
}


// 新增VpnGateway
export function addVpnGateway(data) {
    return request({
        url: '/api/v1/vpn-gateway',
        method: 'post',
        data: data
    })
}

// 修改VpnGateway
export function updateVpnGateway(data) {
    return request({
        url: '/api/v1/vpn-gateway/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除VpnGateway
export function delVpnGateway(data) {
    return request({
        url: '/api/v1/vpn-gateway',
        method: 'delete',
        data: data
    })
}

