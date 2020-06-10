//导入getrequest，因为要发送请求
import {getRequest} from "./api";

/**
 * 菜单初始化方法，传两个参数
 * @param router 菜单格式化之后要加到router里，所以要传一个router对象
 * @param store 数据还要往store保存一份
 */
export const initMenu = (router, store) => {
    //先判断，如果store里面的routes是否有数据，如果大于零就有数据，就不用加载
    if (store.state.routes.length > 0) {
        return;
    }
    /***
     * 请求接口
     * data:服务端返回的数据
     */
    getRequest("/system/cfg/menu").then(data => {
        if (data) {
            //定义一个变量
            let fmtRoutes = formatRoutes(data);
            router.addRoutes(fmtRoutes);
            //调用store/index.js中的initRoutes方法，初始化数据 第一个参数是方法名，第二个参数是数据
            store.commit('initRoutes', fmtRoutes)
        }
    })
}
export const formatRoutes = (routes) => {
    //定义一个数组，最终返回的数据
    let fmtRoutes = [];
    //循环遍历routes，每一项加一个router
    routes.forEach(router => {
        //批量变量定义,相当于 let path=router.path
        let {
            path,
            component,
            name,
            meta,
            iconCls,
            children
        } = router
        //有children children还是数组的实例，说明他是一级菜单，一级菜单要递归调用
        if (children && children instanceof Array) {
            children = formatRoutes(children);
        }
        let fmtRouter = {
            path: path,
            name: name,
            iconCls: iconCls,
            children: children,
            //动态的去加载component的值
            component(resolve) {
                /*startsWith()用于检测字符串是否以指定的前缀开始，根据判断结果返回 true 或 false*/
                if (component.startsWith("Home")) {
                    //require（[组件的地址],resolve） ../上一级utils再上一级src   component服务端返回来的component字符串
                    require(['../views/' + component + '.vue'], resolve);
                } else if (component.startsWith("Emp")) {
                    //require（[组件的地址],resolve） ../上一级utils再上一级src   component服务端返回来的component字符串
                    require(['../views/emp/' + component + '.vue'], resolve);
                } else if (component.startsWith("Per")) {
                    require(['../views/per/' + component + '.vue'], resolve);
                } else if (component.startsWith("Sal")) {
                    require(['../views/sal/' + component + '.vue'], resolve);
                } else if (component.startsWith("Sta")) {
                    require(['../views/sta/' + component + '.vue'], resolve);
                } else if (component.startsWith("Sys")) {
                    require(['../views/sys/' + component + '.vue'], resolve);
                }
            }

        }
        fmtRoutes.push(fmtRouter);
    })
    return fmtRoutes;
}