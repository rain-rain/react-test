import { CALL_HISTORY_METHOD } from "./actions";

/**
 * This middleware captures CALL_HISTORY_METHOD actions to redirect to the
 * provided history object. This will prevent these actions from reaching your
 * reducer or any middleware that comes after this one.
 */

// 从这里可以看到 如果action的类型不为CALL_HISTORY_METHOD就直接放行
// 让下一个中间件去处理 如果当前类型等于CALL_HISTORY_METHOD则触发history
// 下面来看一下CALL_HISTORY_METHOD这个究竟是个什么东西
export default function routerMiddleware(history) {
  return () => next => action => {
    if (action.type !== CALL_HISTORY_METHOD) {
      return next(action);
    }

    const { payload: { method, args } } = action;
    history[method](...args);
  };
}
