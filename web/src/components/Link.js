/* global ga */

import React from 'react';

const trackLinkClick = (props, next) => () => {
  const {
    gaEventCategory,
    gaEventAction,
    gaEventLabel,
    gaEventValue,
    href,
  } = props;

  if (typeof ga === 'function') {
    ga(
      'send',
      'event',
      gaEventCategory,
      gaEventAction,
      gaEventLabel || href,
      gaEventValue,
      next,
    );
  }

  if (typeof next === 'function') {
    next(props);
  }
};

const Link = (
  {
    children,
    gaEventCategory,
    gaEventAction,
    gaEventLabel,
    gaEventValue,
    href,
    onClick,
    track,
    ...props
  },
) => (
  <a
    {...props}
    href={href}
    onClick={
      track
        ? trackLinkClick(
          { gaEventCategory, gaEventAction, gaEventLabel, gaEventValue, href },
          onClick,
        )
        : onClick
    }
  >
    {children}
  </a>
);

Link.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.element,
    React.PropTypes.string,
  ]).isRequired,
  gaEventCategory: React.PropTypes.string,
  gaEventAction: React.PropTypes.string,
  gaEventLabel: React.PropTypes.string,
  gaEventValue: React.PropTypes.string,
  href: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func,
  track: React.PropTypes.bool,
};

Link.defaultProps = {
  gaEventCategory: 'link',
  gaEventAction: 'click',
  gaEventLabel: undefined,
  gaEventValue: undefined,
  onClick: undefined,
  track: true,
};

export default Link;
