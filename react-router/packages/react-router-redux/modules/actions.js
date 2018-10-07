/**
 * This action type will be dispatched by the history actions below.
 * If you're writing a middleware to watch for navigation events, be sure to
 * look for actions of this type.
 */
export const CALL_HISTORY_METHOD = "@@router/CALL_HISTORY_METHOD";

// 我们所有调用的push replace的type都是CALL_HISTORY_METHOD
function updateLocation(method) {
  return (...args) => ({
    type: CALL_HISTORY_METHOD,
    payload: { method, args }
  });
}

/**
 * These actions correspond to the history API.
 * The associated routerMiddleware will capture these events before they get to
 * your reducer and reissue them as the matching function on your history.
 */
export const push = updateLocation("push");
export const replace = updateLocation("replace");
export const go = updateLocation("go");
export const goBack = updateLocation("goBack");
export const goForward = updateLocation("goForward");

export const routerActions = { push, replace, go, goBack, goForward };

// react-router-redux的运行机制
// 当你用push或者replace进行任何操作的时候
// 最终都会被转换成history中对应的方法
// 然后因为我们对history进行了操作 所以会触发他对应的回调
// 通过这种方式来做到了页面的跳转

// 页面被重新渲染 ———— react-router
