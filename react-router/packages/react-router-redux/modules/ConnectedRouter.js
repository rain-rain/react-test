import React from "react";
import PropTypes from "prop-types";
import { Router } from "react-router";

import { LOCATION_CHANGE } from "./reducer";

class ConnectedRouter extends React.Component {
  static contextTypes = {
    store: PropTypes.object
  };

  //这个事件的作用很简单 当路由发生变化
  //就发起一次dispatch用来重新刷新页面
  //在这里得来先屡一下这个调用的先后顺序
  handleLocationChange = (location, action) => {
    this.store.dispatch({
      type: LOCATION_CHANGE,
      payload: {
        location,
        action
      }
    });
  };

  // 如果当前不是isSSR服务端渲染的话
  // 那么就会发起一个监听, 用来监听当前路由的变化
  // 如果history发生变化时, 触发handleLocationChange事件
  componentWillMount() {
    const { store: propsStore, history, isSSR } = this.props;
    this.store = propsStore || this.context.store;

    if (!isSSR)
      this.unsubscribeFromHistory = history.listen(this.handleLocationChange);

    this.handleLocationChange(history.location);
  }

  componentWillUnmount() {
    if (this.unsubscribeFromHistory) this.unsubscribeFromHistory();
  }

  render() {
    return <Router {...this.props} />;
  }
}

if (__DEV__) {
  ConnectedRouter.propTypes = {
    store: PropTypes.object,
    history: PropTypes.object.isRequired,
    children: PropTypes.node,
    isSSR: PropTypes.bool
  };
}

export default ConnectedRouter;
