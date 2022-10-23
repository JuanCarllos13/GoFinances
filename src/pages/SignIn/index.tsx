import React, { useState } from "react";
import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper,
  ActivityIndicator,
} from "./styles";

import AppleSvg from "../../assets/apple.svg";
import GoogleSvg from "../../assets/google.svg";
import LogoSvg from "../../assets/logo.svg";
import { RFValue } from "react-native-responsive-fontsize";
import { useAuth } from "../../hook/auth";

import { SignInButton } from "../../components/SignInButton";
import { Alert, Platform } from "react-native";

export function SignIn() {
  const [isLoading, setIsloading] = useState(false);
  const { signWithGoogle, signWithApple } = useAuth();

  async function handleSignInGoogle() {
    try {
      setIsloading(true);
      return await signWithGoogle();
    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possível conectar a conta Google");
    }
  }

  async function handleSignInApple() {
    try {
      setIsloading(true);
      return await signWithApple();
    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possível conectar a conta Apple");
      setIsloading(false);
    }
  }
  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg width={RFValue(120)} height={RFValue(68)} />

          <Title>
            Controle suas {"\n"}
            finanças de forma {"\n"}
            muito simples
          </Title>
        </TitleWrapper>

        <SignInTitle>
          Faça seu login com {"\n"}
          uma das contas abaixo
        </SignInTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          <SignInButton
            title="Entrar com Google"
            svg={GoogleSvg}
            onPress={handleSignInGoogle}
          />
          {Platform.OS === "ios" && (
            <SignInButton
              title="Entrar com Apple"
              svg={AppleSvg}
              onPress={handleSignInApple}
            />
          )}
        </FooterWrapper>

        {isLoading && <ActivityIndicator />}
      </Footer>
    </Container>
  );
}
