import request from '@/utils/request' 
export default {
    //条件查询带分页查询课程
    getCourseList(page, limit, searchObj) { 
        return request({
            url: `/eduservice/coursefront/getFrontCourseList/${page}/${limit}`, 
            method: 'post',
            data: searchObj
        })
    },
    //查询所有课程分类
    getAllSubject() { 
        return request({
            url: `/eduservice/subject/getAllSubject`, 
            method: 'get'
        })
    },
    //课程详情的方法
    getCourseInfo(id) {
        return request({
            url: `/eduservice/coursefront/getFrontCourseInfo/${id}`, 
            method: 'get'
        })
    }
}
