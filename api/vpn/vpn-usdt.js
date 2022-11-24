import request from '@/utils/request'

export function usdtTransfer(data) {
    return request({
        url: '/api/v1/usdt/transfer',
        method: 'post',
        data: data
    })
}