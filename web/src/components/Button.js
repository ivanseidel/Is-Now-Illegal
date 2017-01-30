import styled from 'styled-components';

import { button } from '../styles/variables';

export default styled.button`
  padding: 10px 20px;
  font-size: 24px;
  border: 0;
  border-radius: ${({ radius }) => radius || 0}px;
  background-color: ${button.backgroundColor};
  color: ${button.foregroundColor};
  text-align: center;

  &:focus {
    outline:none;
  }
`;
