import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal, ModalBody } from 'reactstrap';  // Reactstrap Modal
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleOnClose = () => {
    navigate('/');
  };

  return (
    <Modal
      isOpen={location.pathname === "/account/register" || location.pathname === "/account/login"}
      toggle={handleOnClose}
      centered // This ensures the modal content is centered vertically
    >
      <ModalBody style={{ backgroundColor: '#0D0D0D' }}>
        {location.pathname === "/account/register" ? <RegisterForm /> : <LoginForm />}
      </ModalBody>
    </Modal>
  );
};

export default Auth;
