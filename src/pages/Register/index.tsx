import React, { useState, useEffect } from "react";
import { Keyboard, Modal, TouchableWithoutFeedback, Alert } from 'react-native'
import { Button } from "../../components/Forms/Button";
import { SelectCategory } from "../../components/Forms/CategorySelect";
import { useForm, Controller } from "react-hook-form";
import { InputForm } from '../../components/Forms/InputForm'
import { TransactionTypeButton } from "../../components/Forms/TransactionTypeButton";
import { CategorySelect } from '../CategorySelect'
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage'
import uuid from 'react-native-uuid'
import {useNavigation} from '@react-navigation/native'

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes
} from './styles'

export type FormData = {
  name: string;
  amount: string;
}
const schema = Yup.object().shape({
  name: Yup
    .string()
    .required('Nome é obrigatório'),
  amount: Yup
    .number()
    .typeError("Informe um valor numérico")
    .positive("O valor não pode ser negativo")
    .required("O valor é obrigatório")
})

type NavigationProps = {
  navigate:(screen:string) => void;
}

export function Register() {
  const [transactionType, setTransactionType] = useState('')
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Category',
  })


  const navigation = useNavigation<NavigationProps>()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  })

  function handleTransactionsTypeSelect(type: 'up' | 'down') {
    setTransactionType(type)
  }

  function handleCloseCategorySelectModal() {
    setCategoryModalOpen(false)
  }

  function handleOpenCategorySelectModal() {
    setCategoryModalOpen(true)
  }



 async function handleRegister(form: Partial<FormData>) {


    if (!transactionType)
      return Alert.alert("Selecione o tipo da transação")

    if (category.key === 'category')
      return Alert.alert("Selecione a categoria")

    const newTransactions = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      transactionType,  
      category: category.key,
      date: new Date()
    }

    try{
      const dataKey = "@gofinances:transactions"
      const data = await AsyncStorage.getItem(dataKey)
      const currentData = data ? JSON.parse(data) : []

      const dataFormatted = [
        ...currentData,
        newTransactions
      ]

      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted))

      reset()
      setTransactionType('')
      setCategory({
        key: 'category',
        name: 'Category',
      })

      navigation.navigate("Listagem")

    }catch(err){
      console.log(err)
      Alert.alert("Não foi possível salvar")
    }
  }
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              control={control}
              name="name"
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm
              control={control}
              name="amount"
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}

            />

            <TransactionTypes>
              <TransactionTypeButton
                type='up'
                title="Income"
                onPress={() => handleTransactionsTypeSelect('up')}
                isActive={transactionType === 'up'}
              />

              <TransactionTypeButton
                type='down'
                title="Outcome"
                onPress={() => handleTransactionsTypeSelect('down')}
                isActive={transactionType === 'down'}
              />

            </TransactionTypes>

            <SelectCategory
              title={category.name}
              onPress={handleOpenCategorySelectModal}
            />

          </Fields>
          <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
        </Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeCategorySelect={handleCloseCategorySelectModal}
          />
        </Modal>
      </Container >
    </TouchableWithoutFeedback>

  )
}