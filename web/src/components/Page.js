import styled from 'styled-components';

import { backgroundColor, foregroundColor } from '../styles/variables';

export default styled.div`
  display: flex;
  flex: 1;
  min-height: 100%;
  background-color: ${({ background }) => (background || backgroundColor)};
  padding: 20px;
  color: ${foregroundColor};
`;
