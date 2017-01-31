import React, { Component } from 'react';
import Clipboard from 'clipboard';
import styled from 'styled-components';

import Button from '../components/Button';
import CenterBox from '../components/CenterBox';
import H1 from '../components/H1';
import Page from '../components/Page';
import SubjectText from '../components/SubjectText';
import { colors, radius } from '../styles/variables';

const padding = 20;

const GifContainer = styled.div`
  margin: auto;
  padding: ${padding}px;
  max-width: 500px;
  background-color: #fff;
  border-radius: ${radius}px;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);
`;

const Gif = styled.img`
  width: 100%;
  min-height: 300px;
`;

const Footer = styled.div`
  display: flex;
  margin: -${padding}px;
  margin-top: ${padding}px;
  padding: ${padding / 2}px;
  border-bottom-left-radius: ${radius}px;
  border-bottom-right-radius: ${radius}px;
  background-color: ${colors.blue};
`;

const ShareLink = styled.a`
  flex: 1;
  align-self: center;
  color: #fff;
  text-align: right;
  text-decoration: none;
  font-size: 12px;
  font-weight: 300;
  opacity: 0.95;
`;

const CopyButton = styled(Button)`
  margin-left: ${padding}px;
  background-color: transparent;
  border-color: #fff;
  font-size: 12px;
  font-weight: 300;
  color: #fff;
  opacity: 0.95;
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

  state = { copiedURL: '' };

  componentDidMount = () => {
    const { backgroundColor, changeBackgroundColor } = this.props;

    changeBackgroundColor(backgroundColor);
  };

  onCopySuccess = ({ text }) => {
    this.setState({ copiedURL: text });
  };

  onCopyError = () => {
    this.setState({ copiedURL: '' });
  };

  registerClipboardListener = htmlElementRef => {
    if (!htmlElementRef) return;

    if (this.clipboardInstance) {
      this.clipboardInstance.destroy();
      console.log('destroy', this.clipboardInstance);
    }

    this.clipboardInstance = new Clipboard(htmlElementRef);
    this.clipboardInstance.on('success', this.onCopySuccess);
    this.clipboardInstance.on('error', this.onCopyFailed);
  };

  clipboardInstance = null;

  render() {
    const { copiedURL } = this.state;
    const { match: { params: { subject } } } = this.props;

    const url = window.location.href;
    const copied = copiedURL === url;

    return (
      <Page background="transparent">
        <CenterBox>
          <H1><SubjectText>{subject}</SubjectText> is now illegal!</H1>
          <GifContainer>
            <Gif src={`${process.env.PUBLIC_URL}/img/example.gif`} />
            <Footer>
              <ShareLink href={url}>{url}</ShareLink>
              <CopyButton
                innerRef={this.registerClipboardListener}
                data-clipboard-text={url}
                outline
                small
              >
                {copied ? 'Copied!' : 'Copy'}
              </CopyButton>
            </Footer>
          </GifContainer>
        </CenterBox>
      </Page>
    );
  }
}
