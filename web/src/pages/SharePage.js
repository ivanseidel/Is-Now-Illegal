import React, { Component } from 'react';
import Clipboard from 'clipboard';
import styled from 'styled-components';
// import download from 'downloadjs';
import { withRouter } from 'react-router-dom';

import firebase from '../libs/firebase';
import Button, { ButtonLink } from '../components/Button';
import CenterBox from '../components/CenterBox';
import LoadingPage, {
  defaultBackgroundColor as loadingBackgroundColor,
} from '../pages/LoadingPage';
import H1 from '../components/H1';
import Page from '../components/Page';
import SubjectText from '../components/SubjectText';
import { colors, radius } from '../styles/variables';
import { formatSubject, tryEncodeURI } from '../utils/helpers';

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

const Row = styled.div`
  display: flex;
  flex: 1;
  flex-direction: ${({ horizontal }) => (horizontal ? 'row' : 'column')};
  align-items: center;
  margin-top: ${padding}px;
  color: ${({ muted, invert }) => (
    muted
      ? (invert ? '#ddd' : '#999')
      : (invert ? '#fff' : '#333')
  )};
  font-size: 17px;
  text-align: left;

  & a {
    color: ${({ invert }) => (invert ? '#fff' : '#000')};
  }
`;

const SocialButtons = styled.div`
  flex: 1;
`;

const DownloadButton = styled(ButtonLink)`
  margin-left: ${padding / 2}px;
  background-color: #3d3e3d;
  color: #fff;
`;

const Footer = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: -${padding}px;
  margin-top: ${padding}px;
  padding-bottom: ${padding}px;
  border-bottom-left-radius: ${radius}px;
  border-bottom-right-radius: ${radius}px;
  background-color: ${colors.blue};
`;

const ShareLink = styled.a`
  flex: 1;
  margin-left: ${padding / 2}px;
  color: #fff;
  text-align: right;
  text-decoration: none;
  font-family: 'Alfa Slab One', 'sans-serif', Verdana;
  font-size: 12px;
  font-weight: 300;
  opacity: 0.95;
`;

const CopyButton = styled(Button)`
  margin-left: ${padding / 2}px;
  margin-right: ${padding / 2}px;
  background-color: transparent;
  border-color: #fff;
  font-family: 'Alfa Slab One', 'sans-serif', Verdana;
  font-size: 12px;
  font-weight: 300;
  color: #fff;
  opacity: 0.95;
`;

class SharePage extends Component {
  static defaultProps = {
    action: '',
    backgroundColor: colors.red,
    processing: false,
  };

  static propTypes = {
    action: React.PropTypes.string,
    backgroundColor: React.PropTypes.string,
    changeBackgroundColor: React.PropTypes.func.isRequired,
    processing: React.PropTypes.bool,
    push: React.PropTypes.func.isRequired,
    setMessage: React.PropTypes.func.isRequired,
    subject: React.PropTypes.string.isRequired,
  };

  state = {
    copiedURL: '',
    loading: true,
    gifURL: '',
    gifFirebaseRef: null,
    // TODO: Checking action as a workaroung
    // while we dont receive it as prop by doing  push('xx', { processing: true })
    processing: !!this.props.processing || this.props.action === 'PUSH',
    subject: formatSubject(this.props.subject),
  };

  componentDidMount = () => {
    this.loadGif();
    this.updateBackgroundColor();
    this.updateAddThis();
  };

  componentWillReceiveProps = ({ subject }) => {
    const formattedSubject = formatSubject(subject);

    if (formattedSubject && formattedSubject !== this.state.subject) {
      this.setState({ subject: formattedSubject }, () => {
        this.loadGif();
      });
    }
  };

  componentWillUnmount = () => {
    this.goOffline();
  };

  onCopySuccess = ({ text }) => {
    this.setState({ copiedURL: text });
  };

  onCopyError = () => {
    this.setState({ copiedURL: '' });
  };

  getBeautifulGifURL = () => tryEncodeURI(`http://share.isnowillegal.com/${this.state.subject.toUpperCase()}.gif`);
  getShareURL = () => tryEncodeURI(`http://share.isnowillegal.com/${this.state.subject}`);
  getDownloadURL = () =>
    tryEncodeURI(`http://share.isnowillegal.com/${this.state.subject}.gif`);

  goOnline = () => {
    firebase.database().goOnline();

    clearInterval(this.interval);
    // go offline after 20 seconds on this page
    this.interval = setInterval(() => {
      firebase.database().goOffline();
    }, 20000);
  };

  goOffline = () => {
    const { gifFirebaseRef } = this.state;

    if (gifFirebaseRef) gifFirebaseRef.off();
    firebase.database().goOffline();
    clearInterval(this.interval);
  };

  loadGif = () => {
    const {
      gifFirebaseRef: oldGifFirebaseRef,
      processing,
      subject,
    } = this.state;
    const { push, setMessage } = this.props;

    this.setState({ loading: true });

    // unlisten to previous gif database reference
    if (oldGifFirebaseRef) oldGifFirebaseRef.off();
    this.goOnline();

    const gifFirebaseRef = firebase
      .database()
      .ref(`gifs/${subject.toUpperCase()}/url`);
    gifFirebaseRef.on('value', snapshot => {
      const gifURL = snapshot.val() || '';
      // got the url, stop listening for changes
      if (gifURL) {
        gifFirebaseRef.off();
        this.goOffline();
        setMessage('');
        this.setState(
          { gifFirebaseRef, gifURL, loading: false, processing: false },
          () => {
            this.updateBackgroundColor();
            this.updateAddThis();
          },
        );
      } else if (!processing) {
        this.goOffline();
        setMessage('');

        // user opened by url
        // we saw if exists. it didnt. so lets redirect it to the main page
        push(`/#${subject}`);
      }
    });
  };

  download = () => {
    // download(this.getDownloadURL());
    alert('Right click at the Gif > Save image as...', 'How to download');
  };

  updateAddThis = () => {
    setTimeout(
      () => {
        if (
          window.addthis && typeof window.addthis.layers.refresh === 'function'
        ) {
          window.addthis.layers.refresh();
        }
      },
      500,
    );
  };

  updateBackgroundColor = () => {
    const { loading } = this.state;
    const { backgroundColor, changeBackgroundColor } = this.props;

    changeBackgroundColor(loading ? loadingBackgroundColor : backgroundColor);
  };

  registerClipboardListener = htmlElementRef => {
    if (!htmlElementRef) return;

    // TODO: Improve this later.
    // if (this.clipboardInstance) {
      // this.clipboardInstance.destroy();
    // }

    const clipboardInstance = new Clipboard(htmlElementRef);

    clipboardInstance.on('success', this.onCopySuccess);
    clipboardInstance.on('error', this.onCopyFailed);
  };

  // clipboardInstance = null;

  render() {
    const { copiedURL, gifURL, loading, processing, subject } = this.state;
    const { changeBackgroundColor, setMessage } = this.props;

    if (loading || processing) {
      return (
        <LoadingPage
          changeBackgroundColor={changeBackgroundColor}
          processing={processing}
          setMessage={setMessage}
          subject={subject}
        />
      );
    }

    const shareURL = this.getShareURL();
    const gifURLtoCopy = this.getBeautifulGifURL();

    return (
      <Page background="transparent" title={`${subject} Is Now Illegal!`}>
        <CenterBox>
          <H1><SubjectText>{subject}</SubjectText> is now illegal!</H1>
          <GifContainer>
            <Gif src={gifURL} loading={loading} />
            <Row horizontal invert>
              <SocialButtons>
                <div
                  className="addthis_inline_share_toolbox"
                  data-title={`${subject} is now illegal! #IsNowIllegal`}
                  data-url={shareURL}
                />
              </SocialButtons>
              <DownloadButton href={gifURL} size={14} download>
                Download
              </DownloadButton>
            </Row>
            <Row muted>
              <p>
                👉 Sharing tip: Download the image, then upload where you want (e.g{' '}
                <a href="http://twitter.com" target="_blank">twitter.com</a>). It's better do this than use above sharing buttons!
              </p>
            </Row>
            <Footer>
              <Row horizontal invert>
                <ShareLink href={shareURL}>{shareURL}</ShareLink>
              </Row>

              <Row horizontal invert>
                <CopyButton
                  innerRef={this.registerClipboardListener}
                  data-clipboard-text={shareURL}
                  size={12}
                  outline
                >
                  {copiedURL === shareURL ? 'Copied share link!' : ' Copy share link '}
                </CopyButton>

                <CopyButton
                  innerRef={this.registerClipboardListener}
                  data-clipboard-text={gifURLtoCopy}
                  size={12}
                  outline
                >
                  {copiedURL === gifURLtoCopy ? 'Copied GIF Link!' : ' Copy GIF link '}
                </CopyButton>
              </Row>
            </Footer>
          </GifContainer>
        </CenterBox>
      </Page>
    );
  }
}

export default withRouter(SharePage);
