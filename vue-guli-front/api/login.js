import request from '@/utils/request' 
export default {
    //登录
    submitLoginUser(userInfo) { 
        return request({
            url: `/educenter/member/login`, 
            method: 'post',
            data: userInfo 
        })
    },

    //根据 token 获取用户信息
    getLoginUserInfo() { 
        return request({
            url: `/educenter/member/getMemberInfo`, 
            method: 'get',
            // headers: {'token': cookie.get('guli_token')}
        })
        //headers: {'token': cookie.get('guli_token')}
    } 
}
