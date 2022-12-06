import request from '@/utils/request'

export default {
    // 1. 添加小节
    addVideo(video) {
        return request({
            url: '/eduservice/video/addVideo',
            method: 'post',
            data: video
        })
    },
    // 2. 根据ID 查询小节信息
    getVideo(id) {
        return request({
            url: `/eduservice/video/getVideo/${id}`,
            method: 'get'
        })
    },
    // 3. 修改小节
    updateVideo(video) {
        return request({
            url: '/eduservice/video/updateVideo',
            method: 'post',
            data: video
        })
    },
    // 4. 删除小节信息
    deleteVideo(id) {
        return request({
            url: `/eduservice/video/${id}`,
            method: 'delete'
        })
    },
    // 5. 删除视频
    deleteAliyunVod(id) {
        return request({
            url: `/eduvod/video/removeAlyVideo/${id}`,
            method: 'delete'
        })
    }
}
