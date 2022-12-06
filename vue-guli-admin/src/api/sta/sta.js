import request from '@/utils/request'

const api_name = '/edustatistics/sta/registerCount'

export default {
    // 生成统计数据
    createStatistics(day) { 
        return request({
            url: `${api_name}/${day}`, 
            method: 'post'
        }) 
    },
    // 获取统计数据
    getDataSta(searchObj) { 
        return request({
            url: `/edustatistics/sta/showData/${searchObj.type}/${searchObj.begin}/${searchObj.end}`, 
            method: 'get'
        }) 
    }
}
