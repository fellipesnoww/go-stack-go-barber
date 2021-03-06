import React, {useCallback, useRef} from "react";
import {Image, View, ScrollView, KeyboardAvoidingView, Platform, TextInput, Alert} from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from "@react-navigation/native"; 
import {Form} from '@unform/mobile';
import {FormHandles, useField} from '@unform/core';
import * as Yup from "yup";
import getValidationErrors from '../../utils/getValidationErros';
import {useAuth} from '../../hooks/auth';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

import {Container, Title, ForgotPassword, ForgotPasswordText, CreateAccountButton, CreateAccountButtonText} from "./styles";

interface SignInFormData{
    email:string;
    password: string;
}

const SignIn: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const passwordInputRef = useRef<TextInput>(null);

    const navigation = useNavigation();

    const {signIn, user} = useAuth();       

    const handleSignIn = useCallback(
        async (data: SignInFormData) => {
          try {
            formRef.current?.setErrors({});
    
            const schema = Yup.object().shape({
              email: Yup.string()
                .email('Digite um e-mail válido')
                .required('E-mail obrigatório'),
              password: Yup.string().required('Senha obrigatória'),
            });
    
            await schema.validate(data, {
              abortEarly: false,
            });
    
            await signIn({
              email: data.email,
              password: data.password,
            });
    
            //history.push('/dashboard');
          } catch (err) {
            if (err instanceof Yup.ValidationError) {
              const errors = getValidationErrors(err);
    
              formRef.current?.setErrors(errors);
    
              return;
            }
    
            Alert.alert('Erro na autenticação', 'Ocorreu um erro ao fazer login, cheque suas credenciais')
            
          }
        },
        [signIn]);

    return (
        <>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{flex: 1}}
            enabled>
                <ScrollView
                contentContainerStyle={{flex:1}}
                keyboardShouldPersistTaps="handled">               
                    <Container>
                        <Image source={logoImg}/>
                        <View>
                            <Title>Faça seu logon</Title>
                        </View>

                        <Form ref={formRef} onSubmit={handleSignIn}>
                            <Input  
                                autoCorrect={false}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                name="email"
                                icon="mail"
                                placeholder="Email"
                                returnKeyType="next"
                                onSubmitEditing={() => {                                    
                                    passwordInputRef.current?.focus();
                                }}
                            />
                            <Input 
                                ref={passwordInputRef}
                                secureTextEntry
                                name="password" 
                                icon="lock" 
                                placeholder="Senha"
                                returnKeyType="send"
                                onSubmitEditing={() => {
                                    formRef.current?.submitForm();
                                }}
                            />                        
                        </Form>

                        <Button onPress={() => {
                                formRef.current?.submitForm();
                        }}>Entrar</Button>

                        <ForgotPassword onPress={() => {
                            formRef.current?.submitForm();
                        }}>
                            <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
                        </ForgotPassword>
                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>
            
            <CreateAccountButton onPress={() => navigation.navigate("SignUp")}>
                <Icon name="log-in" size={20} color="#FF9000"/>
                <CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
            </CreateAccountButton>
        </>
    )
}
       

export default SignIn;