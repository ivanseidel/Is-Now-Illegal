import React from 'react';
import styled from 'styled-components';

import { button, radius as defaultRadius } from '../styles/variables';

const Button = styled.button`
  padding: ${({ small }) => (small ? '4px 8px' : '10px 20px')};
  font-size: ${({ small }) => (small ? '12px' : '22px')};
  border: 1px solid transparent;
  border-color: ${({ color, outline }) => (outline ? color : 'transparent')};
  border-radius: ${({ radius }) => radius || 0}px;
  background-color: ${({ color, outline }) => (outline ? 'transparent' : color)};
  color: ${button.foregroundColor};
  text-align: center;
  text-transform: uppercase;
  ${({ disabled }) => (disabled ? 'opacity: 0.8;' : '')}

  &:focus {
    outline:none;
  }
`;

Button.defaultProps = {
  outline: false,
  radius: defaultRadius,
  small: false,
};

Button.propTypes = {
  outline: React.PropTypes.bool,
  radius: React.PropTypes.number,
  small: React.PropTypes.bool,
};

export default Button;
