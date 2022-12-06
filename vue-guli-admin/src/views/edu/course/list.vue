<template>
    <div class="app-container">

        <!-- 查询表单 -->
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="课程名称">
                <el-input v-model="courseQuery.title" placeholder="课程名称"/> 
            </el-form-item>
            <el-form-item label="课程状态">
                <el-select v-model="courseQuery.status" clearable placeholder="课程状态"> 
                    <el-option :value="Normal" label="已发布"/>
                    <el-option :value="Draft" label="未发布"/> 
                </el-select>
            </el-form-item>
            <el-form-item label="添加时间">
                <el-date-picker
                    v-model="courseQuery.begin"
                    type="datetime"
                    placeholder="选择开始时间" 
                    value-format="yyyy-MM-dd HH:mm:ss" 
                    default-time="00:00:00"
                />
            </el-form-item>
            <el-form-item>
                <el-date-picker
                    v-model="courseQuery.end"
                    type="datetime"
                    placeholder="选择截止时间" 
                    value-format="yyyy-MM-dd HH:mm:ss" 
                    default-time="00:00:00"
                />
            </el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getList()">查 询</el-button>
            <el-button type="default" @click="resetData()">清 空</el-button> 
        </el-form>

        <!-- 表格 -->
        <el-table
            :data="list"
            border
            fit
            highlight-current-row>
            <el-table-column
                label="序号"
                width="70"
                align="center">
                <template slot-scope="scope">
                    {{ (page - 1) * limit + scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column prop="title" label="课程名称"  align="center"/>
            <el-table-column label="课程状态" width="120" align="center">
                <template slot-scope="scope">
                    {{ scope.row.status==='Normal'?'已发布':'未发布' }}
                </template>
            </el-table-column>
            <el-table-column prop="lessonNum" label="课时数" width="100" align="center"/>
            <el-table-column prop="gmtCreate" label="添加时间" width="200" align="center"/>
            <el-table-column prop="viewCount" label="浏览数量" width="100" align="center"/>
            <el-table-column label="操作" width="450" align="center">
                <template slot-scope="scope">
                    <router-link :to="'/course/info/'+scope.row.id">
                        <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程基本信息</el-button>
                    </router-link>
                    <router-link :to="'/course/chapter/'+scope.row.id">
                        <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程大纲</el-button>
                    </router-link>
                    <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除课程信息</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
            :current-page="page" 
            :page-size="limit" 
            :total="total"
            style="padding: 30px 0; text-align: center;" 
            layout="total, prev, pager, next, jumper" 
            @current-change="getList"
        />

    </div>
</template>

<script>
import course from '@/api/edu/course'
export default {
    data() {         // 定义变量和初始值
        return {
            list: null,         // 查询之后接口返回的集合
            page: 1,            // 当前页
            limit: 10,          // 每页显示记录数
            total: 0,           // 总记录数
            courseQuery: {},    // 条件封装对象
            Normal: 'Normal',
            Draft: 'Draft'
        }
    },
    created() {
        // 调用
        this.getList()
    },
    methods: {
        // 课程列表的方法
        getList(page = 1) {
            this.page = page
            course.getCourseListPage(this.page, this.limit, this.courseQuery)
                .then(response => {
                    this.list = response.data.rows
                    this.total = response.data.total
                    console.log(this.list)  
                    console.log(this.total)
                })
        },
        // 清空查询框
        resetData() {
            this.courseQuery = {}  // 清空表单输入项的数据
            this.getList()      // 查询所有课程列表
        },
        // 删除课程的方法
        removeDataById(id) {
            this.$confirm('此操作将永久删除课程信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                course.deleteCourseId(id)
                    .then(response => {
                        // 提示信息
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        // 回到列表页
                        this.getList()
                    })  
            }).catch(() => {})
        }
    }
}
</script>
