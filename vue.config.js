/***
 * 在nodejs里面配置请求转发，前端的请求先发到nodejs上，nodejs再发到后端
 */
/***
 * 定义代理对象，是一个空对象
 */
let proxyObj = {};
/***
 * 拦截http请求
 * @type {{}}
 */
proxyObj['/'] = {
    ws: false,
    //目标转发地址，把拦截到的请求转移到targeturl上
    target: 'http://localhost:9527',
    //false：请求头中host仍然是浏览器发送过来的host；true：发送请求头中host会设置成target
    changeOrigin: true,
    //拦截到的地址不去修改
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