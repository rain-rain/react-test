import React from "react";
import PropTypes from "prop-types";
import warning from "warning";

import RouterContext from "./RouterContext";
import warnAboutGettingProperty from "./utils/warnAboutGettingProperty";

function getContext(props, state) {
  return {
    history: props.history,
    location: state.location,
    match: Router.computeRootMatch(state.location.pathname),
    staticContext: props.staticContext
  };
}

/**
 * The public API for putting history on context.
 */
class Router extends React.Component {
  static computeRootMatch(pathname) {
    return { path: "/", url: "/", params: {}, isExact: pathname === "/" };
  }

  // TODO: Remove this
  static childContextTypes = {
    router: PropTypes.object.isRequired
  };

  // TODO: Remove this
  getChildContext() {
    const context = getContext(this.props, this.state);

    if (__DEV__) {
      const contextWithoutWarnings = { ...context };

      Object.keys(context).forEach(key => {
        warnAboutGettingProperty(
          context,
          key,
          `You should not be using this.context.router.${key} directly. It is private API ` +
            "for internal use only and is subject to change at any time. Instead, use " +
            "a <Route> or withRouter() to access the current location, match, etc."
        );
      });

      context._withoutWarnings = contextWithoutWarnings;
    }

    return {
      router: context
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      location: props.history.location
    };

    // Router在这里对history进行了一个监听
    // 只要你发起了一个dispatch并且正常调用了history以后
    // 这边就会接收到这个更新 并且触发一次setState
    // 如果父级刷新的时候 所有的children都会进行一次render计算
    // 所以页面的刷新其实就是这么来的
    this.unlisten = props.history.listen(location => {
      this.setState({ location });
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    const context = getContext(this.props, this.state);

    return (
      <RouterContext.Provider
        children={this.props.children || null}
        value={context}
      />
    );
  }
}

if (__DEV__) {
  Router.propTypes = {
    children: PropTypes.node,
    history: PropTypes.object.isRequired,
    staticContext: PropTypes.object
  };

  Router.prototype.componentDidUpdate = function(prevProps) {
    warning(
      prevProps.history === this.props.history,
      "You cannot change <Router history>"
    );
  };
}

export default Router;
