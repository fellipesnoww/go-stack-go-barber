import React from 'react';
import logo from '../../assets/logo.svg';
import {FiMail, FiLock, FiUser, FiArrowLeft} from 'react-icons/fi';
import { Container, Content, Background } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';

const SignUp: React.FC = () => {
  return (
      <Container>
          <Background />
          <Content>
              <img src={logo} alt="GoBarber"/>
              <form>
                  <h1>Faça seu Cadastro</h1>

                  <Input name="name" icon={FiUser} placeholder="Nome"/>

                  <Input name="email" icon={FiMail} placeholder="E-mail"/>

                  <Input name="password" icon={FiLock} type="password" placeholder="Senha"/>

                  <Button type="submit">Casdastrar</Button>

              </form>
              <a href="">
                  <FiArrowLeft />
                  Voltar para o logon
              </a>
              
          </Content>          
      </Container>
  );
}

export default SignUp;