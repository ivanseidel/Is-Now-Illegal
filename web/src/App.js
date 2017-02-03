import React, { Component } from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './reset.css';
import './index.css';

import Link from './components/Link';
import Footer from './components/Footer';
import MainPage from './pages/MainPage';
import PageContainer from './components/PageContainer';
import SharePage from './pages/SharePage';
import { colors, padding } from './styles/variables';

// fix github page router path handler
const basename = window.location.hostname.indexOf('github') >= 0 &&
  window.location.pathname.split('/')[1]
  ? `/${window.location.pathname.split('/')[1]}`
  : undefined;

const Header = styled.header`
  padding: ${padding}px;
  text-align: center;
`;

const HeaderMessage = styled.p`
  color: lightyellow;
`;

export default class extends Component {
  state = { backgroundColor: colors.blue, message: '' };

  setMessage = message => {
    this.setState({ message });
  };

  changeBackgroundColor = backgroundColor => {
    this.setState({ backgroundColor });
  };

  render() {
    const { backgroundColor, message } = this.state;

    return (
      <Router basename={basename}>
        <PageContainer background={backgroundColor}>
          <Header>
            {
              message && (
                <HeaderMessage>
                  {message}
                </HeaderMessage>
              )
            }
          </Header>
          <Switch>
            <Route
              path="/"
              render={props => {
                if (window.location.search[0] === '?') {
                  const subject = window.location.search.replace('?', '');
                  return <SharePage subject={decodeURI(subject)} {...props} />;
                }

                return <MainPage {...props} />;
              }}
              changeBackgroundColor={this.changeBackgroundColor}
              setMessage={this.setMessage}
              exact
            />
            <Route
              path="/:subject"
              render={({ match: { params: { subject } }, ...props }) => (
                <SharePage subject={decodeURI(subject)} {...props} />
              )}
              changeBackgroundColor={this.changeBackgroundColor}
              setMessage={this.setMessage}
            />
          </Switch>
          <Footer>
            <p>
              <Link
                className="github-button"
                href="https://github.com/ivanseidel/Is-Now-Illegal"
                data-style="mega"
                data-count-href="/ivanseidel/Is-Now-Illegal/stargazers"
                data-count-api="/repos/ivanseidel/Is-Now-Illegal#stargazers_count"
                data-count-aria-label="# stargazers on GitHub"
                aria-label="Star ivanseidel/Is-Now-Illegal on GitHub"
                onClick={() => alert('a')}
              >
                Star on GitHub
              </Link>
            </p>
            <p>A nerdy protest made by </p>
            <p>
              <Link href="https://github.com/ivanseidel" target="_blank">
                Ivan Seidel
              </Link>
              {', '}
              <Link href="https://twitter.com/brunolemos" target="_blank">
                Bruno Lemos
              </Link>
              {' & '}
              <Link href="https://github.com/joaopedrovbs" target="_blank">
                João Pedro
              </Link>
            </p>
          </Footer>
        </PageContainer>
      </Router>
    );
  }
}
