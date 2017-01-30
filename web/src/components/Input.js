import styled from 'styled-components';

export default styled.input`
  padding: 10px 20px;
  font-size: 24px;
  border: 0;
  border-radius: ${({ radius }) => radius || 0}px;
  background-color: #fff;
  color: #000;

  &:focus {
    outline:none;
  }
`;
