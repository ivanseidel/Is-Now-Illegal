import React, { Component } from 'react';
import styled from 'styled-components';

import Button from '../components/Button';
import CenterBox from '../components/CenterBox';
import Form from '../components/Form';
import H1 from '../components/H1';
import Page from '../components/Page';
import Input from '../components/Input';
import { radius } from '../styles/variables';

const SubjectText = styled.span`
  color: #333;
  font-weight: bold;
  text-transform: uppercase;
`;

const FormInput = styled(Input)`
  flex: 1;
  background-color: #fff;
  color: #2b325f;
  text-transform: uppercase;
  
  @media (max-width: 600px) {
    width: 100%;
  }
`;

const FormButton = styled(Button)`
  background-color: transparent;
  text-transform: uppercase;
  
  @media (max-width: 600px) {
    width: 100%;
    margin-top: 10px;
  }
`;

const FormBigText = styled.p`
  width: 100%;
  line-height: 50px;
  font-size: 24px;
  text-align: center;
  vertical-align: middle;
`;

const StyledForm = styled(Form)`
  min-height: 70px;
  padding: 10px;
  background-color: #ed2127;
`;

export default class App extends Component {
  state = { processing: false, subject: '' };
  subjectInput = null;

  illegalize = subject => {
    if (!subject) return;

    this.setState({ processing: true });

    setTimeout(() => {
      this.setState({ processing: false });
    }, 3000);
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

  handleSubjectChange = e => this.setState({ subject: e.target.value });

  render() {
    const { processing, subject } = this.state;

    return (
      <Page>
        {
          processing && (
            <CenterBox>
              <H1>Making <SubjectText>{subject}</SubjectText> illegal...</H1>
              <StyledForm radius={radius}>
                <FormBigText>Please wait...</FormBigText>
              </StyledForm>
            </CenterBox>
          )
        }
        {
          !processing && (
            <CenterBox>
              <H1>What's going to be illegal?</H1>
              <StyledForm onSubmit={this.submitIllegalize} radius={radius}>
                <FormInput
                  innerRef={ref => {
                    this.subjectInput = ref;
                  }}
                  type="text"
                  name="subject"
                  placeholder="Stuff"
                  defaultValue={subject}
                  onChange={this.handleSubjectChange}
                  radius={radius}
                  autoFocus
                />
                <FormButton type="submit">Illegalize!</FormButton>
              </StyledForm>
            </CenterBox>
          )
        }
      </Page>
    );
  }
}
