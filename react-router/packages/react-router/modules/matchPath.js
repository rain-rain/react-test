import pathToRegexp from "path-to-regexp";

const cache = {};
const cacheLimit = 10000;
let cacheCount = 0;

function compilePath(path, options) {
  // 这里会将你的参数变成一个文本
  const cacheKey = `${options.end}${options.strict}${options.sensitive}`;

  // 这里会根据传进来的end strict sensitive来进行分类
  // 如有两条数据
  // 1.end:true,strict:false, sensitive:true
  // 2.end:true,strict:false, sensitive:false
  // 那么就会在cache里面保存两条这个数据 并且将这个对应进行返回
  const pathCache = cache[cacheKey] || (cache[cacheKey] = {});

  // 这里返回的这个pathCache也就是指定类的集合 里面放的都是同等类型的
  // 如果pathCache中有相同的话 就直接返回相同的 不进行其他多余的运算
  if (pathCache[path]) return pathCache[path];

  // 首次初始化的时候 这边肯定是为空的 所以这边进行运算 生成一个最新的值
  const keys = [];
  const regexp = pathToRegexp(path, keys, options);
  const result = { regexp, keys };

  // 这里要注意 你的每次路由跳转以及初始化都会使用cacheCount
  // 最大值是10000 也就是说 如果超过了10000
  // 则下次进行不会使用cache里面的值而是每次都进行计算返回最新的数据
  if (cacheCount < cacheLimit) {
    pathCache[path] = result;
    cacheCount++;
  }

  // 返回最新的计算结果
  return result;
}

/**
 * Public API for matching a URL pathname to a path.
 */
function matchPath(pathname, options = {}) {
  // 如果options类型为string类型的话 则path变成options
  if (typeof options === "string") options = { path: options };

  const { path, exact = false, strict = false, sensitive = false } = options;

  const { regexp, keys } = compilePath(path, { end: exact, strict, sensitive });
  const match = regexp.exec(pathname);

  // 如果不匹配则直接返回null表示你当前这个组件的route不符合也就不会刷新出来
  if (!match) return null;

  // 分解url
  const [url, ...values] = match;
  const isExact = pathname === url;

  // 如果设置为强制匹配 但是实际结果不强制的话 也直接null不刷新显示
  if (exact && !isExact) return null;

  // 一切正常的时候 返回对应的match来刷新页面
  return {
    path, // the path used to match
    url: path === "/" && url === "" ? "/" : url, // the matched portion of the URL
    isExact, // whether or not we matched exactly
    params: keys.reduce((memo, key, index) => {
      memo[key.name] = values[index];
      return memo;
    }, {})
  };
}

export default matchPath;
