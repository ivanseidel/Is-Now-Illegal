import styled from 'styled-components';

export default styled.form`
  padding: 10px;
  background-color: #ed2127;
  border-radius: ${({ radius }) => radius || 0}px;

  @media (min-width: 600px) {
    display: flex;
  }

  &:active {
    background-color: #d4181d;
  }
`;
