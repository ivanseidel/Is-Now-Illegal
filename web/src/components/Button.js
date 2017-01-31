import React from 'react';
import styled from 'styled-components';

import { button, radius as defaultRadius } from '../styles/variables';

const Button = styled.button`
  padding: ${({ size }) => `${size / 2}px ${size}px`};
  font-size: ${({ size }) => `${size}px`};
  border: 1px solid transparent;
  border-color: ${({ color, outline }) => (outline ? color : 'transparent')};
  border-radius: ${({ radius }) => radius || 0}px;
  background-color: ${({ color, outline }) => (outline ? 'transparent' : color)};
  color: ${button.foregroundColor};
  text-align: center;
  text-transform: uppercase;
  ${({ disabled }) => (disabled ? 'opacity: 0.8;' : 'cursor: pointer;')}

  &:focus {
    outline:none;
  }
`;

Button.defaultProps = {
  color: 'transparent',
  disabled: false,
  outline: false,
  radius: defaultRadius,
  size: 22,
};

Button.propTypes = {
  color: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  outline: React.PropTypes.bool,
  radius: React.PropTypes.number,
  size: React.PropTypes.number,
};

export default Button;
