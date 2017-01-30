import React, { Component } from 'react';
import styled from 'styled-components';

import Button from '../components/Button';
import CenterBox from '../components/CenterBox';
import Form from '../components/Form';
import H1 from '../components/H1';
import Page from '../components/Page';
import Input from '../components/Input';
import { radius } from '../styles/variables';

const FormInput = styled(Input)`
  flex: 1;
  background-color: #fff;
  color: #2b325f;
  
  @media (max-width: 600px) {
    width: 100%;
  }
`;

const FormButton = styled(Button)`
  text-transform: uppercase;
  
  @media (max-width: 600px) {
    width: 100%;
    margin-top: 10px;
  }
`;

export default class App extends Component {
  state = { subject: '' };
  subjectInput = null;

  illegalize = (subject) => {
    if (!subject) return;

    alert(`${subject} is now illegal!`);
  };

  submitIllegalize = (e) => {
    e.preventDefault();

    if (!this.state.subject) {
      if (this.subjectInput) this.subjectInput.focus();
      return false;
    }

    this.illegalize(this.state.subject);
    return false;
  };

  handleSubjectChange = e => this.setState({ subject: e.target.value });

  render() {
    return (
      <Page>
        <CenterBox>
          <H1>What's going to be illegal?</H1>
          <Form onSubmit={this.submitIllegalize} radius={radius}>
            <FormInput
              innerRef={(ref) => {
                this.subjectInput = ref;
              }}
              type="text"
              name="subject"
              placeholder="Stuff"
              defaultValue={this.state.subject}
              onChange={this.handleSubjectChange}
              radius={radius}
              autoFocus
            />
            <FormButton type="submit">Illegalize!</FormButton>
          </Form>
        </CenterBox>
      </Page>
    );
  }
}
