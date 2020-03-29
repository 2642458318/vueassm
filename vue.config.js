/***
 * 在nodejs里面配置请求转发，前端的请求先发到nodejs上，nodejs再发到后端
 */
/***
 * 定义代理对象
 */
let proxyObj = {};
/***
 * 拦截http请求
 * @type {{}}
 */
proxyObj['/'] = {
    ws: false,
    //目标转发地址
    target: 'http://localhost:9527',
    changeOrigin: true,
    //请求地址要不要重写
    pathRewrite: {
        '/': ''
    }
}
module.exports = {
    devServer: {
        host: 'localhost',
        port: 8080,
        proxy: proxyObj
    }
}