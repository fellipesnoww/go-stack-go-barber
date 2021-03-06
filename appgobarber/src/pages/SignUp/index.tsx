import React, { useCallback, useRef } from "react";
import {Image, View, ScrollView, KeyboardAvoidingView, Platform, TextInput, Alert} from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from "@react-navigation/native";
import {Form} from '@unform/mobile';
import {FormHandles, useField} from "@unform/core"
import * as Yup from "yup";
import api from '../../services/api';


import Input from '../../components/Input';
import Button from '../../components/Button';

import getValidationErrors from '../../utils/getValidationErros';

import logoImg from '../../assets/logo.png';

import {Container, Title, BackToSignInButton, BackToSignInText} from "./styles";

interface SignUpFormData{
    name: string;
    email:string;
    password: string;
}

const SignUp: React.FC = () => {

    const navigation = useNavigation();
    const formRef = useRef<FormHandles>(null);
    const emailInputRef = useRef<TextInput>(null);    const passwordInputRef = useRef<TextInput>(null);
   

    const handleSignUp = useCallback(
        async (data: SignUpFormData) => {
          try {
            formRef.current?.setErrors({});
    
            const schema = Yup.object().shape({
              name: Yup.string().required('O nome é obrigatório'),
              email: Yup.string()
                .email('Digite um e-mail válido')
                .required('E-mail obrigatório'),
              password: Yup.string().min(6, 'No mínimo 6 digitos.'),
            });
    
            await schema.validate(data, {
              abortEarly: false,
            });
    
            await api.post('/users', data);

            Alert.alert('Cadastro Realizado com sucesso', 'Você já pode realizar login na aplicação');

            navigation.goBack();
    
            //history.push('/dashboard');
          } catch (err) {
            if (err instanceof Yup.ValidationError) {
              const errors = getValidationErrors(err);
    
              formRef.current?.setErrors(errors);
    
              return;
            }
    
            Alert.alert('Erro ao realizar cadastro', 'Ocorreu um erro ao realizar cadastro, tente novamente');
            
          }
        },
        [navigation]);

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
                            <Title>Crie sua conta</Title>
                        </View>

                        <Form ref={formRef}
                            onSubmit={handleSignUp}>
                            <Input 
                                autoCapitalize="words"
                                name="name"
                                icon="user"
                                placeholder="Nome"
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    emailInputRef.current?.focus();
                                }}/>
                            <Input 
                                ref={emailInputRef}
                                keyboardType="email-address"
                                autoCorrect={false}
                                autoCapitalize="none"
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
                                textContentType="newPassword"
                                name="password"
                                icon="lock"
                                placeholder="Senha"
                                returnKeyType="send"
                                onSubmitEditing={() => {
                                    formRef.current?.submitForm();
                                }}/>
                        </Form>
                        
                        <Button onPress={() => {
                                formRef.current?.submitForm();
                            }}>Cadastrar</Button>
                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>

            <BackToSignInButton onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={20} color="#FFF"/>
                <BackToSignInText>Voltar para Logon</BackToSignInText>
            </BackToSignInButton>            
        </>
    )
}
       

export default SignUp;