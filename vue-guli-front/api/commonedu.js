import request from '@/utils/request'

export default {
    // 根据 课程ID 获取评论，带分页
    getPageList(page, limit, courseId) { 
        return request({
            url: `/eduservice/comment/getCommentPage/${page}/${limit}`, 
            method: 'get',
            params: {courseId} 
        })
    },
    // 添加评论
    addComment(comment) { 
        return request({
            url: `/eduservice/comment/auth/saveComment`, 
            method: 'post',
            data: comment 
        })
    } 
}
