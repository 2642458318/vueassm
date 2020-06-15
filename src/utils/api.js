//导入axios依赖
import axios from 'axios'
//element ui 全局消息提示（单独引入message调用message方法）
import {Message} from 'element-ui';
import router from "../router";

/**
 * 响应拦截器
 */
axios.interceptors.response.use(success => {
    /**
     * success.status 是http的响应码200 success.data.status是后台返回的json的响应码
     * 说明这是业务上过的一个错误，我刻意返回来的失败
     */
    if (success.status && success.status == 200 && success.data.status == 500) {
        //调用error方法，success.data.msg()是后端RespBean里面的message
        Message.error({message: success.data.msg})
        /**
         * return空，在请求调用的地方什么数据都拿不到，在请求调用的地方只需要判断有没有数据，没有数据说明请求时失败的
         */
        return;
    }
    /***
     * 如果后端返回msg就提示一下，不返回就不提示
     */
    if (success.data.msg) {
        console.log(success.data.msg);
        Message.success({message: success.data.msg})
    }
    /**
     * 成功返回数据，
     */
    return success.data;
}, error => {
    if (error.response.status == 504 || error.response.status == 404) {
        Message.error({message: "服务器被吃了"})
    } else if (error.response.status == 403) {
        Message.error({message: "权限不足，请联系管理员"})
    } else if (error.response.status == 401) {
        Message.error({message: "尚未登录，请登录"});
        router.replace("/")
    } else {
        //显示服务端返回的错误信息
        if (error.response.data.msg()) {
            Message.error({message: error.response.data.msg})
        } else {
            Message.error({message: "未知错误"})
        }
    }
    return;
})

/**
 * 统一前缀，用单引号，双引号就变成了死的字符串了
 * @type {string}
 */
let base = '';
/**
 * 接收两个参数(用户名，密码)
 * @param url 请求地址
 * @param params 请求参数
 * @returns {AxiosPromise}
 */
export const postKeyValueRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = '';
            for (let i in data) {
                console.log(i);
                //追加变量,encodeURIComponent的作用为重新编码
                ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&';
            }
            console.log(ret);
            return ret;
        }],
        /**
         * 定义header
         */
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}
/***
 * 请求方式：post
 * @param url
 * @param params
 * @returns {AxiosPromise}
 */
export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params
    })
}
/***
 * 请求方式：put
 * @param url
 * @param params
 * @returns {AxiosPromise}
 */
export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params
    })
}
/***
 * 请求方式：get
 * @param url
 * @param params
 * @returns {AxiosPromise}
 */
export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        data: params
    })
}
/***
 * 请求方式：delete
 * @param url
 * @param params
 * @returns {AxiosPromise}
 */
export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        data: params
    })
}