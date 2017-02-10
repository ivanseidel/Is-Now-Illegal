import styled from 'styled-components'

export default styled.form`
  border-radius: ${({ radius }) => radius || 0}px;

  @media (min-width: 600px) {
    display: flex;
  }

  &:hover, &:active {
    background-color: #d4181d;
  }

  &:active {
    background-color: #d4181d;
    box-shadow: 4px 4px 20px rgba(0, 0, 0, 0.25);
  }
`
