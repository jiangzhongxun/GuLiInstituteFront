import request from '@/utils/request'

export default {
    // 1. 添加课程信息
    addCourseInfo(courseInfo) {
        return request({
            url: '/eduservice/course/addCourseInfo',
            method: 'post',
            data: courseInfo
        })
    },
    // 2. 查询所有讲师
    getListTeacher() {
        return request({
            url: '/eduservice/teacher/findAll',
            method: 'get'
        })
    },
    // 3、根据课程 ID 查询课程基本信息
    getCourseInfoId(id) {
        return request({
            url: '/eduservice/course/getCourseInfo/' + id,
            method: 'get'
        })
    },
    // 4、修改课程信息
    updataCourseInfo(courseInfo) {
        return request({
            url: '/eduservice/course/updateCourseInfo',
            method: 'post',
            data: courseInfo
        })
    },
    // 5、课程确认发布信息显示
    getPublishCourseInfo(id) {
        return request({
            url: '/eduservice/course/getPublishCourseInfo/' + id,
            method: 'get'
        })
    },
    // 6、课程最终发布
    publishCourse(id) {
        return request({
            url: '/eduservice/course/publishCourse/' + id,
            method: 'post'
        })
    },
    // 7、课程列表带分页
    // current: 当前页, limit: 每页记录数, courseQuery: 条件对象
    getCourseListPage(current, limit, courseQuery) {
        return request({
            //url: '/eduservice/course/pageCourseCondition/'+current+'/'+limit,
            url: `/eduservice/course/pageCourseCondition/${current}/${limit}`,
            method: 'post',
            // courseQuery: 条件对象; 后端使用 RequestBody 获取数据
            // data 表示把对象转换成 json 进行传递到接口里面
            data: courseQuery
        })
    },
    // 8、 删除课程
    deleteCourseId(id) {
        return request({
            url: `/eduservice/course/${id}`,
            method: 'delete'
        })
    }
}

