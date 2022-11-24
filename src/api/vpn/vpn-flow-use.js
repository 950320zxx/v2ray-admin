import request from '@/utils/request'

// 查询VpnFlowUse列表
export function listVpnFlowUse(query) {
    return request({
        url: '/api/v1/vpn-flow-use',
        method: 'get',
        params: query
    })
}

// 查询VpnFlowUse详细
export function getVpnFlowUse (id) {
    return request({
        url: '/api/v1/vpn-flow-use/' + id,
        method: 'get'
    })
}


// 新增VpnFlowUse
export function addVpnFlowUse(data) {
    return request({
        url: '/api/v1/vpn-flow-use',
        method: 'post',
        data: data
    })
}

// 修改VpnFlowUse
export function updateVpnFlowUse(data) {
    return request({
        url: '/api/v1/vpn-flow-use/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除VpnFlowUse
export function delVpnFlowUse(data) {
    return request({
        url: '/api/v1/vpn-flow-use',
        method: 'delete',
        data: data
    })
}

