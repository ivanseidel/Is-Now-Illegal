import React, { Component } from 'react';
import styled from 'styled-components';

import CenterBox from '../components/CenterBox';
import H1 from '../components/H1';
import Page from '../components/Page';
import SubjectText from '../components/SubjectText';
import { colors, radius } from '../styles/variables';

const GifContainer = styled.div`
  margin: auto;
  padding: 20px;
  max-width: 500px;
  background-color: #fff;
  border-radius: ${radius}px;
`;

const Gif = styled.img`
  width: 100%;
  min-height: 300px;
`;

export default class extends Component {
  static defaultProps = { backgroundColor: colors.red };

  static propTypes = {
    backgroundColor: React.PropTypes.string,
    changeBackgroundColor: React.PropTypes.func.isRequired,
    match: React.PropTypes.shape({
      params: React.PropTypes.shape({
        subject: React.PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  componentDidMount = () => {
    const { backgroundColor, changeBackgroundColor } = this.props;

    changeBackgroundColor(backgroundColor);
  };

  render() {
    const { match: { params: { subject } } } = this.props;

    return (
      <Page background="transparent">
        <CenterBox>
          <H1><SubjectText>{subject}</SubjectText> is now illegal!</H1>
          <GifContainer>
            <Gif src={`${process.env.PUBLIC_URL}/img/example.gif`} />
          </GifContainer>
        </CenterBox>
      </Page>
    );
  }
}
