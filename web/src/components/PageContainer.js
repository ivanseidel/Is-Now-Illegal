import styled from 'styled-components'

export default styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 100%;
  ${({ background }) => background && `background-color: ${background}`};
  transition: background-color ease-in-out 0.2s 0.1s;
`
