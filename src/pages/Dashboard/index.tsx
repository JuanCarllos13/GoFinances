import React from "react";
import { View, Text } from 'react-native'

import { HighlightCard } from "../../components/HighlightCard";
import { TransactionCard } from "../../components/Transactionscard";

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
  Title
} from './styles'

export function Dashboard() {
  const data = {
    title:'Desenvolvimento de site',
    amount:"R$ 12.000,00",
    category:{ 
        name:'Vendas',
        icon: 'dollar-sign'
      },
      date:'13/04/2020'
  }

  return (
    <Container>
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
        <HighlightCard type='up' title='Entradas' amount='R$ 17.400,00' lastTransaction="Última entrada dia 13 de abril" />
        <HighlightCard type='down' title='Saídas' amount='R$ 1.259,00' lastTransaction="Última saída dia 03 de abril" />
        <HighlightCard type='total' title='Total' amount='R$ 16.141,00' lastTransaction="01 à 16 de abril" />
      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>

        <TransactionCard
        data={data}
        />
      </Transactions>

    </Container>
  )
}

