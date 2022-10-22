import setSeconds from "date-fns/esm/fp/setSeconds/index.js";
import React from "react";
import { 
  Container,
  Title,
  Amount,
 } from "./styles";

 interface Props {
  title: string,
  color: string,
  amount: string
 }


export function HistoryCard({amount, color, title}: Props) {
  return (
    <Container color={color}>
      <Title>{title}</Title>
      <Amount>{amount}</Amount>

    </Container>
  )
}