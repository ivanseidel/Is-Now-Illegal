import styled from 'styled-components';

export default styled.div`
  margin: auto;
  width: 50%;

  @media (max-width: 1024px) {
      width: 80%;
  }

  @media (max-width: 768px) {
      flex: 1;
      width: 100%;
  }
`;
