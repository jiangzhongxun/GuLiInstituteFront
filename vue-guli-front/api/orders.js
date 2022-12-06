import request from '@/utils/request' 

export default {
    // 创建订单
    createdOrders(courseId) { 
        return request({
            url: `/eduorder/order/createOrder/${courseId}`, 
            method: 'post'
        })
    },
    // 根据订单 ID 获取订单信息
    getOrderInfo(id) { 
        return request({
            url: `/eduorder/order/getOrderInfo/${id}`, 
            method: 'get'
        })
    },
    // 根据订单号生成微信支付二维码
    createdNative(orderNo) {
        return request({
            url: `/eduorder/paylog/createNative/${orderNo}`, 
            method: 'get'
        })
    },
    // 根据订单号查询支付状态
    queryPayStatus(orderNo) {
        return request({
            url: `/eduorder/paylog/queryPayStatus/${orderNo}`, 
            method: 'get'
        })
    }
}
