import React from "react";
import { Button, TextInput, View, Text } from "react-native";

export function Profile() {
  return (
    <View>

    <Text testID="title">
      Testando

    </Text>


      <TextInput testID="input-name" placeholder="Nome" value="Juan" />

      <TextInput
        testID="input-surname"
        placeholder="SobreNome"
        value="Amaral"
      />

      <Button title="Salvar" />
    </View>
  );
}
