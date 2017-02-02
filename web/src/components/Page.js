import React from 'react';
import styled from 'styled-components';
import DocumentTitle from 'react-document-title';

import { backgroundColor, foregroundColor } from '../styles/variables';
import { APP_TITLE } from '../utils/constants';

const Page = styled.div`
  display: flex;
  flex: 1;
  background-color: ${({ background }) => background};
  padding: 20px;
  color: ${({ foreground }) => foreground};
`;

Page.defaultProps = {
  background: backgroundColor,
  foreground: foregroundColor,
};

Page.propTypes = {
  background: React.PropTypes.string,
  foreground: React.PropTypes.string,
};

const PageWithTitle = ({ title, ...props }) => (
  <DocumentTitle title={title}>
    <Page {...props} />
  </DocumentTitle>
);

PageWithTitle.defaultProps = { ...Page.defaultProps, title: APP_TITLE };
PageWithTitle.propTypes = { ...Page.propTypes, title: React.PropTypes.string };

export default PageWithTitle;
