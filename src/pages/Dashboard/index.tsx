import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'
import { useTheme } from 'styled-components'

import { HighlightCard } from "../../components/HighlightCard";
import { TransactionCard, TransactionCardProps } from "../../components/Transactionscard";

import AsyncStorage from '@react-native-async-storage/async-storage'

import {
  Container,
  Header,
  UserInfo,
  UserWrapper,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionsList,
  LoadContainer
} from './styles'

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface highlighProps {
  amount: string
  lastTransaction : string
}

interface highlighData {
  entries: highlighProps;
  expensive: highlighProps
  total: highlighProps;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [transactions, setTransactions] = useState<DataListProps[]>([])
  const [highlighData, setHighlighData] = useState<highlighData>({} as highlighData)

  const theme = useTheme()

  function getLastTransactionDat(collection : DataListProps[], 
    type: 'positive' | 'negative'){
    const lastTransactions= new Date(
      Math.max.apply(Math,
        collection
          .filter(transaction => transaction.type === type) // pegando as card com o positivo
          .map(transaction=> new Date(transaction.date).getTime()))//pegando só as data e convertando o em numero
    )

    return `${lastTransactions.getDate()} de ${lastTransactions.toLocaleString('pt-BR', {
      month: 'long'
    })}`
  }

  async function loadTransactions() {
    const dataKey = "@gofinances:transactions"
    const response = await AsyncStorage.getItem(dataKey)
    const transactions = response ? JSON.parse(response) : []

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transactionsFormatted: DataListProps[] =
      transactions.map((item: DataListProps) => {

        if (item.type === 'positive') {
          entriesTotal += Number(item.amount)
        } else {
          expensiveTotal += Number(item.amount)
        }

        const amount = Number(item.amount).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });

        const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        }).format(new Date(item.date))

        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date,
        }
      })

    setTransactions(transactionsFormatted)
   const lastTransactionEntries = getLastTransactionDat(transactions, 'positive')
   const lastTransactionExpense = getLastTransactionDat(transactions, 'negative')
   const totalInterval = ` 1 a ${lastTransactionExpense}`

    const total = entriesTotal - expensiveTotal

    setHighlighData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: `Última entrada dia ${lastTransactionEntries}`
      },
      expensive: {
        amount: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: `Última saída dia ${lastTransactionEntries}`
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: totalInterval
      }
    })

    setIsLoading(false)
  }

  // async function removeAll(){
  //   await AsyncStorage.removeItem(dataKey)
  // }
  // removeAll()

  useEffect(() => {
    loadTransactions()
    // async function removeAll() {
    //   await AsyncStorage.removeItem(dataKey)
    // }
    // removeAll()
  }, [])

  useFocusEffect(useCallback(() => { // renderizar a lista automaticamente
    loadTransactions()
  }, []))


  return (
    <Container>
      {
        isLoading ?
          <LoadContainer>
            <ActivityIndicator
              color={theme.colors.primary}
              size='large'
            />
          </LoadContainer> :
          <>
            <Header>
              <UserWrapper>
                <UserInfo>
                  <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/86435195?v=4' }} />
                  <User>
                    <UserGreeting>Olá, </UserGreeting>
                    <UserName>Juan</UserName>
                  </User>
                </UserInfo>
                <Icon name={'power'} />
              </UserWrapper>
            </Header>

            <HighlightCards>
              <HighlightCard type='up' title='Entradas' amount={highlighData?.entries?.amount} lastTransaction={highlighData?.entries?.lastTransaction} />
              <HighlightCard type='down' title='Saídas' amount={highlighData?.expensive?.amount} lastTransaction={highlighData?.expensive?.lastTransaction} />
              <HighlightCard type='total' title='Total' amount={highlighData?.total?.amount} lastTransaction={highlighData?.total?.lastTransaction} />
            </HighlightCards>

            <Transactions>
              <Title>Listagem</Title>

              <TransactionsList
                data={transactions}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <TransactionCard data={item} />}
              />
            </Transactions>
          </>
      }
    </Container>
  )
}

