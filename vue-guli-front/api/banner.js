import request from '@/utils/request.js'

export default {
    // 查询前两条 banner 数据
    getListBanner() {
        return request({
            url: `/educms/bannerfront/getAllBanner`, 
            method: 'get'
        }) 
    }
}
