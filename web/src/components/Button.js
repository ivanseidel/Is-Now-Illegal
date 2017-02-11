import React from 'react'
import styled, { css } from 'styled-components'

import Link from './Link'
import { button, radius as defaultRadius } from '../styles/variables'

export const style = css`
  padding: ${({ size }) => `${size / 2}px ${size}px`};
  font-family: 'Alfa Slab One', 'sans-serif', Verdana;
  font-size: ${({ size }) => `${size}px`};
  border: 1px solid transparent;
  border-color: ${({ color, outline }) => (outline ? color : 'transparent')};
  border-radius: ${({ radius }) => radius || 0}px;
  background-color: ${({ color, outline }) => (outline ? 'transparent' : color)};
  color: ${button.foregroundColor};
  text-align: center;
  text-transform: uppercase;
  ${({ disabled }) => (disabled ? 'opacity: 0.4;' : 'cursor: pointer;')}

  &:focus {
    outline:none;
  }
`

const Button = styled.button`
  ${style}
`

Button.defaultProps = {
  color: 'transparent',
  disabled: false,
  outline: false,
  radius: defaultRadius,
  size: 22
}

Button.propTypes = {
  color: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  outline: React.PropTypes.bool,
  radius: React.PropTypes.number,
  size: React.PropTypes.number
}

export default Button

export const ButtonLink = styled(Link)`
  ${style}
`

ButtonLink.defaultProps = Button.defaultProps
ButtonLink.propTypes = Button.propTypes
