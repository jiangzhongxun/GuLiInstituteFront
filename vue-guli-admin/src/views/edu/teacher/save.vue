<template>
    <div class="app-container">
        
        <p>讲师添加</p>

        <el-form label-width="120px">
            <el-form-item label="讲师名称">
                <el-input v-model="teacher.name"/> 
            </el-form-item>

            <el-form-item label="讲师排序">
                <el-input-number v-model="teacher.sort" controls-position="right" :min="0"/>
            </el-form-item>

            <el-form-item label="讲师头衔">
                <el-select v-model="teacher.level" clearable placeholder="请选择">
                    <!--
                      数据类型一定要和取出的json中的一致，否则没法回填 
                      因此，这里value使用动态绑定的值，保证其数据类型是number
                    -->
                    <el-option :value="1" label="高级讲师"/> 
                    <el-option :value="2" label="首席讲师"/>
                </el-select>
            </el-form-item>

            <el-form-item label="讲师资历">
                <el-input v-model="teacher.career"/> 
            </el-form-item>

            <el-form-item label="讲师简介">
                <el-input v-model="teacher.intro" :rows="10" type="textarea"/> 
            </el-form-item>

            <!-- 讲师头像：TODO -->
            <el-form-item label="讲师头像"> 
                <!-- 头衔缩略图 -->
                <pan-thumb :image="String(teacher.avatar)"/> 
                <!-- 文件上传按钮 -->
                <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像</el-button>
                <!--
                    v-show：是否显示上传组件
                    :key：类似于id，如果一个页面多个图片上传控件，可以做区分 
                    :url：后台上传的url地址
                    @close：关闭上传组件
                    @crop-upload-success：上传成功后的回调 
                -->
                <image-cropper
                    v-show="imagecropperShow" 
                    :width="300"
                    :height="300"
                    :key="imagecropperKey"
                    :url="BASE_API+'/eduoss/fileoss'" 
                    field="file"
                    @close="close"
                    @crop-upload-success="cropSuccess"/>
            </el-form-item>

            <el-form-item>
                <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
            </el-form-item> 
        </el-form>

    </div>
</template>

<script>
// 引入调用 teacher.js 文件
import teacherApi from '@/api/edu/teacher'
import ImageCropper from '@/components/ImageCropper' 
import PanThumb from '@/components/PanThumb'
export default {
    components: {ImageCropper, PanThumb},
    data() {
        return { 
            teacher: {
                name: '', 
                sort: 0, 
                level: 1, 
                career: '', 
                intro: '', 
                // avatar: 'https://guli-file-jzx.oss-cn-beijing.aliyuncs.com/2022/11/17/110e733cdd6646848735b699ca8715e1default.jpg'   // 默认头像
                avatar: ''
            },
            // 上传弹框组件是否显示
            imagecropperShow: false,
            // 上传组价 key值，唯一标识
            imagecropperKey: 0,
            // 获取 dev.env.js里面的地址
            BASE_API: process.env.BASE_API,
            // 保存按钮是否禁用
            saveBtnDisabled: false  
        }
    },
    created() {      // 页面渲染之前执行
        this.init()
    },
    watch: {        // 监听
        $route(to, from) {      // 路由变化方式；路由发生变化，该方法就会执行
            this.init()
        }
    },
    methods: { 
        // 关闭上传弹框的方法
        close() {
            this.imagecropperShow = false
            // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
            this.imagecropperKey = this.imagecropperKey + 1
        },
        // 上传成功的方法
        cropSuccess(data) {
            // 上传之后接口返回图片地址
            //console.log(data)
            this.imagecropperShow = false
            this.teacher.avatar = data.url
            // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
            this.imagecropperKey = this.imagecropperKey + 1
        },
        init() {
            // 判断路径是否有 ID 值，有 ID 就是修改
            if (this.$route.params && this.$route.params.id) {
                // 从路径获取 ID 值
                const id = this.$route.params.id
                // 调用 根据 ID 查询讲师的方法
                this.getInfo(id)
            } else {    // 没有 ID 就是添加，要清空表单数据
                this.teacher = {}
            }
        },
        // 根据 ID 查询讲师的方法
        getInfo(id) {
            teacherApi.getTeacherInfo(id)
                .then(response => {
                    this.teacher = response.data.teacher
                })
        },
        saveOrUpdate() {
            // 根据 teacher 中是否有 ID 判断
            if(!this.teacher.id) {
                // 添加
                // this.saveBtnDisabled = true 
                this.saveTeacher()
            } else {
                // 修改
                this.updateTeacher()
            }
        },
        // 修改讲师的方法
        updateTeacher() {
            teacherApi.updateTeacherInfo(this.teacher)
                .then(response => {
                    // 提示信息
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                    // 回到列表页面 路由跳转
                    this.$router.push({ path: '/teacher/table' })
                })
        },
        // 添加讲师的方法
        saveTeacher() { 
            teacherApi.addTeacher(this.teacher)
                .then(response => {
                    // 提示信息
                    this.$message({
                        type: 'success',
                        message: '添加成功!'
                    });
                    // 回到列表页面 路由跳转
                    this.$router.push({ path: '/teacher/table' })
                })
        }
    }
}
</script>

