import styled from 'styled-components';

export default styled.div`
  flex: 1;
  min-height: 100%;
  ${({ background }) => background && `background-color: ${background}`};
  transition: background-color ease-in-out 0.2s;
`;
