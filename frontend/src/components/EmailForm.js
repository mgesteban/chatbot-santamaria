import React, { useState } from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  width: 350px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #075e54;
  margin: 0 0 20px 0;
  font-size: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #075e54;
  }
`;

const SubmitButton = styled.button`
  background: #075e54;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #128c7e;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 12px;
  margin-top: -10px;
`;

const EmailForm = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    onSubmit(email);
  };

  return (
    <FormContainer>
      <Title>Welcome to Chat Assistant</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email to start chatting"
          aria-label="Email input"
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <SubmitButton 
          type="submit" 
          disabled={!email.trim()}
        >
          Start Chatting
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

export default EmailForm;
