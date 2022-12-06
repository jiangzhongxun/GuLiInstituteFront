import request from '@/utils/request'

export default {
    // 1. 讲师列表带分页
    // current: 当前页, limit: 每页记录数, teacherQuery: 条件对象
    getTeacherListPage(current, limit, teacherQuery) {
        return request({
            //url: '/eduservice/teacher/pageTeacherCondition/'+current+'/'+limit,
            url: `/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,
            method: 'post',
            // teacherQuery: 条件对象; 后端使用 RequestBody 获取数据
            // data 表示把对象转换成 json 进行传递到接口里面
            data: teacherQuery
        })
    },
    // 2. 删除讲师
    deleteTeacherId(id) {
        return request({
            url: `/eduservice/teacher/${id}`,
            method: 'delete'
        })
    },
    // 3. 新增讲师
    addTeacher(teacher) {
        return request({
            url: `/eduservice/teacher/addTeacher`,
            method: 'post',
            data: teacher
        })
    },
    // 3. 根据 ID 查询讲师
    getTeacherInfo(id) {
        return request({
            url: `/eduservice/teacher/getTeacher/${id}`,
            method: 'get'
        })
    },
    // 4. 修改讲师
    updateTeacherInfo(teacher) {
        return request({
            url: `/eduservice/teacher/updateTeacher`,
            method: 'post',
            data: teacher
        })
    }
}

