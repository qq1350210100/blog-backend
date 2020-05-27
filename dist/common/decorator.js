import bodyParser from 'koa-bodyparser';
/**
 * 请求方法
 */
export const requestMethod = {
    GET: 'get',
    POST: 'post',
    PUT: 'pust',
    DELETE: 'delete',
    OPTION: 'option',
    PATCH: 'patch'
};
/**
 * 定义注册的路由数组
 */
export const controllers = [];
/**
 * controller类装饰器
 * @param {string} prefix // 请求路径前缀
 */
export const controller = (prefix = '') => (target) => {
    target.prefix = prefix;
    // 给controller类添加路由前缀
    console.log('Controller: ', target);
};
export function requestMapping({ url = '', method = '', middleware = [] }) {
    return (target, name, descriptor) => {
        // 如果没有传自定义url，默认取方法名作为url
        if (!url)
            url = name;
        // 创建router需要的数据 url，method，middleware（非必需），最终执行的方法，装饰器对象的构造函数
        const controller = {
            url,
            method,
            middleware,
            handler: target[name],
            constructor: target.constructor
        };
        controllers.push(controller);
    };
}
export const get = (url, ...middleware) => requestMapping({ method: requestMethod.GET, url, middleware });
export const post = (url, ...middleware) => requestMapping({ method: requestMethod.POST, url, middleware: [bodyParser(), ...middleware] });
export const put = (url, ...middleware) => requestMapping({ method: requestMethod.PUT, url, middleware: [bodyParser(), ...middleware] });
