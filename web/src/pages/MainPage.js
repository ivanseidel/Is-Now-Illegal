import React, { Component } from 'react';
import styled from 'styled-components';
import qs from 'qs';
import { withRouter } from 'react-router-dom';

import firebase from '../libs/firebase';
import Button from '../components/Button';
import CenterBox from '../components/CenterBox';
import Form from '../components/Form';
import H1 from '../components/H1';
import Input from '../components/Input';
import Page from '../components/Page';
import { colors, radius } from '../styles/variables';
import { SUBJECT_PATTERN_ALLOW } from '../utils/constants';
import { formatSubject, removeIllegalCharacters } from '../utils/helpers';

const FormInput = styled(Input)`
  flex: 1;
  background-color: #fff;
  color: #303030;
  text-transform: uppercase;
  
  @media (max-width: 600px) {
    width: 100%;
  }
`;

const FormButton = styled(Button)`
  background-color: transparent;
  
  @media (max-width: 600px) {
    width: 100%;
    margin-top: 10px;
  }
`;

const StyledForm = styled(Form)`
  min-height: 70px;
  padding: 10px;
  background-color: #ed2127;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);
`;

class App extends Component {
  static defaultProps = { backgroundColor: colors.blue, subject: '' };

  static propTypes = {
    backgroundColor: React.PropTypes.string,
    changeBackgroundColor: React.PropTypes.func.isRequired,
    push: React.PropTypes.func.isRequired,
    subject: React.PropTypes.string,
  };

  state = { subject: this.props.subject || qs.parse(window.location.search.slice(1)).stuff || '' };

  componentDidMount = () => {
    const { backgroundColor, changeBackgroundColor } = this.props;

    changeBackgroundColor(backgroundColor);

    // if (window.location.search) {
    //   window.location.search = '';
    // }
  };

  subjectInput = null;

  illegalize = subject => {
    if (!subject) return;

    const formattedSubject = formatSubject(subject);

    // start gif creation in the server
    firebase.database().ref('/queue/tasks').push({ task: 'gif', word: formattedSubject });

    this.props.push(`/${formattedSubject.toLowerCase()}`, { processing: true });
  };

  submitIllegalize = e => {
    e.preventDefault();

    if (!this.state.subject) {
      if (this.subjectInput) this.subjectInput.focus();
      return false;
    }

    this.illegalize(this.state.subject);
    return false;
  };

  handleSubjectChange = e =>
    this.setState({ subject: removeIllegalCharacters(e.target.value || '') });

  render() {
    const { subject } = this.state;

    return (
      <Page background="transparent">
        <CenterBox>
          <H1>{"What's going to be illegal?"}</H1>
          <StyledForm onSubmit={this.submitIllegalize} radius={radius}>
            <FormInput
              innerRef={ref => {
                this.subjectInput = ref;
              }}
              type="text"
              name="subject"
              placeholder="Stuff"
              value={subject}
              onChange={this.handleSubjectChange}
              radius={radius}
              pattern={SUBJECT_PATTERN_ALLOW}
              autoFocus
            />
            <FormButton
              type="submit"
              onClick={this.submitIllegalize}
              disabled={!subject}
            >
              Illegalize!
            </FormButton>
          </StyledForm>
        </CenterBox>
      </Page>
    );
  }
}

export default withRouter(App);
