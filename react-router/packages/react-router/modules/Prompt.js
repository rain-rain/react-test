import React from "react";
import PropTypes from "prop-types";
import invariant from "invariant";

import RouterContext from "./RouterContext";

class Block extends React.Component {
  constructor(props) {
    super(props);
    this.release = props.method(props.message);
  }

  componentDidUpdate(prevProps) {
    // 前后两次显示的message都不一样的时候 才会开启
    if (prevProps.message !== this.props.message) {
      this.release();
      this.release = this.props.method(this.props.message);
    }
  }

  componentWillUnmount() {
    this.release();
  }

  render() {
    return null;
  }
}

if (__DEV__) {
  const messageType = PropTypes.oneOfType([PropTypes.func, PropTypes.string]);

  Block.propTypes = {
    method: PropTypes.func.isRequired,
    message: messageType.isRequired
  };
}

/**
 * The public API for prompting the user before navigating away from a screen.
 */
// 这个组件的作用是在页面改变的时候给个提醒
function Prompt(props) {
  return (
    <RouterContext.Consumer>
      {context => {
        invariant(context, "You should not use <Prompt> outside a <Router>");

        return props.when ? (
          <Block method={context.history.block} message={props.message} />
        ) : null;
      }}
    </RouterContext.Consumer>
  );
}

Prompt.defaultProps = {
  when: true
};

if (__DEV__) {
  const messageType = PropTypes.oneOfType([PropTypes.func, PropTypes.string]);

  Prompt.propTypes = {
    when: PropTypes.bool,
    message: messageType.isRequired
  };
}

export default Prompt;
