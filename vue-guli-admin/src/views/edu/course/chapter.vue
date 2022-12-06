<template>
    <div class="app-container">
        <h2 style="text-align: center;">发布新课程</h2>
        <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
            <el-step title="填写课程基本信息"/> 
            <el-step title="创建课程大纲"/> 
            <el-step title="最终发布"/>
        </el-steps>

        <el-button type="text" @click="openChapterDialog" >添加章节</el-button>

        <!-- 章节 -->
        <ul class="chanpterList">
            <li v-for="chapter in chapterVideoList" :key="chapter.id">
                <p>{{ chapter.title }}
                    <span class="acts">
                        <el-button type="text" @click="openVideo(chapter.id)">添加课时</el-button>
                        <el-button style="" type="text" @click="openEditChapter(chapter.id)">编辑</el-button> 
                        <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
                    </span> 
                </p>

                <!-- 视频 -->
                <ul class="chanpterList videoList">
                    <li v-for="video in chapter.children" :key="video.id">
                        <p>{{ video.title }} 
                            <span class="acts">
                                <el-button type="text" @click="openEditVideo(video.id)">编辑</el-button> 
                                <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
                            </span> 
                        </p>
                    </li> 
                </ul>
            </li> 
        </ul> 
        <div>
            <el-button @click="previous">上一步</el-button>
            <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
        </div>

        <!-- 添加和修改章节表单 -->
        <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
            <el-form :model="chapter" label-width="120px"> 
                <el-form-item label="章节标题">
                    <el-input v-model="chapter.title"/> 
                </el-form-item>
                <el-form-item label="章节排序">
                    <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
                </el-form-item> 
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogChapterFormVisible = false">取 消</el-button> 
                <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
            </div> 
        </el-dialog>

        <!-- 添加和修改课时表单 -->
        <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
            <el-form :model="video" label-width="120px"> 
                <el-form-item label="课时标题">
                    <el-input v-model="video.title"/> 
                </el-form-item>
                <el-form-item label="课时排序">
                    <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
                </el-form-item>
                <el-form-item label="是否免费">
                    <el-radio-group v-model="video.isFree">
                        <el-radio :label="true">免费</el-radio> 
                        <el-radio :label="false">收费</el-radio>
                    </el-radio-group> 
                </el-form-item>
                <el-form-item label="上传视频">
                    <!-- TODO -->
                    <el-upload
                        :on-success="handleVodUploadSuccess" 
                        :on-remove="handleVodRemove"
                        :before-remove="beforeVodRemove" 
                        :on-exceed="handleUploadExceed" 
                        :file-list="fileList"
                        :action="BASE_API+'/eduvod/video/uploadAlyiVideo'" 
                        :limit="1"
                        class="upload-demo">
                    <el-button size="small" type="primary">上传视频</el-button> 
                    <el-tooltip placement="right-end">
                        <div slot="content">最大支持1G,<br>
                            支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                            GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                            MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                            SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
                        <i class="el-icon-question"/> 
                    </el-tooltip>
                    </el-upload>
                </el-form-item> 
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVideoFormVisible = false">取 消</el-button> 
                <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
            </div> 
        </el-dialog>

    </div>
</template>

<script>
import chapter from '@/api/edu/chapter'
import video from '@/api/edu/video'
export default {
    data() { 
        return {
            saveBtnDisabled: false, // 保存按钮是否禁用 
            courseId: '',
            chapterVideoList: [],
            dialogChapterFormVisible: false,     // 章节弹框
            dialogVideoFormVisible: false,      // 小节弹框
            chapter: {  // 封装章节数据
                title: '',
                sort: 0
            },
            video: {    // 封装小节数据
                title: '',
                sort: 0,
                isFree: false,
                videoSourceId: '',
                videoOriginalName: ''   // 视频名称
            },
            saveVideoBtnDisabled: false,
            fileList: [],   //上传文件列表
            BASE_API: process.env.BASE_API  // 接口API地址
        }
    },
    created() {
        // 获取路由中的 id
        if(this.$route.params && this.$route.params.id) {
            this.courseId = this.$route.params.id
            this.getChapterVideo()
        }
    },
    methods: {
        // 点击删除确定调用的方法
        handleVodRemove() {
            // 调用删除视频接口的方法
            video.deleteAliyunVod(this.video.videoSourceId)
                .then(response => {
                    // 提示信息
                    this.$message({
                        type: 'success',
                        message: '删除视频成功'
                    })
                    // 把文件列表清空
                    this.fileList = []
                    // 删除后要把video中的视频ID和名称的值清空
                    this.video.videoSourceId = ''
                    this.video.videoOriginalName = ''
                })
        },
        // 点击×调用的方法
        beforeVodRemove(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}?`)
        },
        //成功回调
        handleVodUploadSuccess(response, file, fileList) { 
            // 上传视频ID赋值
            this.video.videoSourceId = response.data.videoId
            // 上传视频名称赋值
            this.video.videoOriginalName = file.name
        },
        //视图上传多于一个视频
        handleUploadExceed(files, fileList) {
            this.$message.warning('想要重新上传视频，请先删除已上传的视频') 
        },
        //=======================小节操作=================
        // 添加小节弹窗方法
        openVideo(chapterId) {
            this.video.id = ''
            // 小节弹框
            this.dialogVideoFormVisible = true
            // 设置章节id
            this.video.chapterId = chapterId
            console.log(chapterId)
            console.log(this.video.id)
            // 清空弹窗页面数据
            this.video.title = ''
            this.video.sort = 0
            this.video.isFree = false
            this.video.videoSourceId = ''
            this.video.videoOriginalName = ''
            // 把文件列表清空
            this.fileList = []
        },
        // 添加 / 更新小节
        saveOrUpdateVideo() {
            if (!this.video.id) {
                this.addVideo()
            } else {
                this.updateVideo()
            }
        },
        // 新增小节
        addVideo() {
            // 设置课程id
            this.video.courseId = this.courseId
            video.addVideo(this.video)
                .then(response => {
                    // 关闭添加小节的弹窗
                    this.dialogVideoFormVisible = false
                    // 提示信息
                    this.$message({
                        type: 'success',
                        message: '课时小节添加成功'
                    })
                    // 刷新页面
                    this.getChapterVideo()
                })
        },
        // 修改小节，弹框数据回显
        openEditVideo(id) {
            this.dialogVideoFormVisible = true
            video.getVideo(id)
                .then(response => {
                    this.video = response.data.video
                    this.fileList = [{'name': this.video.videoOriginalName}]
                }).catch(() => { 
                    this.video = {}
                })
        },
        // 修改小节
        updateVideo() {
            video.updateVideo(this.video)
                .then(response => {
                    // 关闭弹窗
                    this.dialogVideoFormVisible = false
                    // 提示信息
                    this.$message({
                        type: 'success',
                        message: '修改课时小节成功！'
                    })
                    // 刷新页面
                    this.getChapterVideo()
                    // 编辑完成后再执行添加，会取到编辑了的小节的ID，导致添加操作失败，所以编辑完之后要将 video 置为空
                    this.video = {}
                })
        },
        // 删除小节
        removeVideo(id) {
            this.$confirm('此操作将永久删除课时小节信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                video.deleteVideo(id)
                    .then(response => {
                        // 提示信息
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        // 回到列表页
                        this.getChapterVideo()
                    })  
            }).catch(() => {})
        },
        //=======================章节操作=================
        // 删除章节
        removeChapter(chapterId) {
            this.$confirm('此操作将永久删除章节信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                chapter.deleteChapter(chapterId)
                    .then(response => {
                        // 提示信息
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        // 回到列表页
                        this.getChapterVideo()
                    })  
            }).catch(() => {})
        },
        // 修改章节
        updateChapter() {
            chapter.updateChapter(this.chapter)
                .then(response => {
                    // 关闭弹窗
                    this.dialogChapterFormVisible = false
                    // 提示信息
                    this.$message({
                        type: 'success',
                        message: '修改章节成功！'
                    })
                    // 刷新页面
                    this.getChapterVideo()
                })
        },
        // 修改章节，弹框数据回显
        openEditChapter(chapterId) {
            this.dialogChapterFormVisible = true
            chapter.getChapter(chapterId)
                .then(response => {
                    this.chapter = response.data.chapter
                })
        },
        // 新增章节弹窗
        openChapterDialog() {
            // 弹窗
            this.dialogChapterFormVisible = true
            console.log(this.courseId)
            console.log(this.chapterId)
            // 清空弹窗页面数据
            this.chapter.title = ''
            this.chapter.sort = 0
        },
        // 添加章节
        addChapter() {
            // 设置课程ID到chapter对象里面
            this.chapter.courseId = this.courseId
            chapter.addChapter(this.chapter)
                .then(response => {
                    // 关闭添加章节的弹窗
                    this.dialogChapterFormVisible = false
                    // 提示信息
                    this.$message({
                        type: 'success',
                        message: '章节添加成功'
                    })
                    // 刷新页面
                    this.getChapterVideo()
                })
        },
        saveOrUpdate() {
            if (!this.chapter.id) {
                this.addChapter()
            } else {
                this.updateChapter()
            }
        },
        // 根据课程 ID 查询章节和小节
        getChapterVideo() {
            chapter.getAllChapterVideo(this.courseId)
                .then(response => {
                    this.chapterVideoList = response.data.allChapterVideo
                })
        },
        previous() {
            console.log('previous')
            // 跳转到第一页
            this.$router.push({ path: '/course/info/' + this.courseId }) 
        },
        next() {
            console.log('next')
            // 跳转到第三页
            this.$router.push({ path: '/course/publish/' + this.courseId }) 
        }
    }
}
</script>

<style scoped>
.chanpterList{ 
    position: relative; 
    list-style: none; 
    margin: 0;
    padding: 0; 
}
.chanpterList li{
    position: relative; 
}
.chanpterList p{ 
    float: left; 
    font-size: 20px; 
    margin: 10px 0; 
    padding: 10px; 
    height: 70px; 
    line-height: 50px; 
    width: 100%;
    border: 1px solid #DDD; 
}
.chanpterList .acts { 
    float: right; 
    font-size: 14px;
}
.videoList{ 
    padding-left: 50px;
}
.videoList p{ 
    float: left; 
    font-size: 14px; 
    margin: 10px 0; 
    padding: 10px; 
    height: 50px; 
    line-height: 30px; 
    width: 100%;
    border: 1px dotted #DDD; 
}
</style>
