import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HistoryCard } from "../../components/HistoryCard";
import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  SelectIcon,
  Month,
  LoadContainer,
} from "./styles";
import { categories } from "../../utils/categories";
import { VictoryPie } from "victory-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useTheme } from "styled-components";
import { addMonths, subMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../hook/auth";

interface TransactionData {
  type: "positive" | "negative";
  name: string;
  amount: string;
  category: String;
  date: string;
}

interface CategoryData {
  key: string;
  name: string;
  total: number;
  totalFormatted: string;
  color: string;
  percent: string;
}

export function Resume() {
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>(
    []
  );
  const [selectedData, setSelectedData] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const theme = useTheme();

  function handleChangeDate(action: "next" | "prev") {
    if (action === "next") {
      setSelectedData(addMonths(selectedData, 1));
    } else {
      setSelectedData(subMonths(selectedData, 1));
    }
  }

  async function loadData() {
    setIsLoading(true);
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const ResponseFormatted = response ? JSON.parse(response) : [];

    const expensives = ResponseFormatted.filter(
      (expensive: TransactionData) =>
        expensive.type === "negative" &&
        new Date(expensive.date).getMonth() === selectedData.getMonth() && // comparando o mes
        new Date(expensive.date).getFullYear() === selectedData.getFullYear() // e o ano
    );

    const expensivesTotal = expensives.reduce(
      (acumullator: number, expensive: TransactionData) => {
        return acumullator + Number(expensive.amount);
      },
      0
    );

    const totalByCategory: CategoryData[] = [];

    categories.forEach((category) => {
      let categorySum = 0;

      expensives.forEach((expensive: TransactionData) => {
        //somando todos os valores das categorias
        if (expensive.category === category.key) {
          categorySum += Number(expensive.amount);
        }
      });

      if (categorySum > 0) {
        // adicionando o total de cada categoria
        const totalFormatted = categorySum.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        const percent = `${((categorySum / expensivesTotal) * 100).toFixed(
          0
        )}%`;

        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          total: categorySum,
          totalFormatted,
          percent,
        });
      }
    }); // não retorna um objeto, ele só percorre
    setTotalByCategories(totalByCategory);
    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      // renderizar a lista automaticamente
      loadData();
    }, [selectedData])
  );

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
      ) : (
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 25,
            paddingBottom: useBottomTabBarHeight(),
          }}
        >
          <MonthSelect>
            <MonthSelectButton onPress={() => handleChangeDate("prev")}>
              <SelectIcon name="chevron-left" />
            </MonthSelectButton>

            <Month>
              {format(selectedData, "MMMM, yyyy", { locale: ptBR })}
            </Month>

            <MonthSelectButton onPress={() => handleChangeDate("next")}>
              <SelectIcon name="chevron-right" />
            </MonthSelectButton>
          </MonthSelect>

          <ChartContainer>
            <VictoryPie
              data={totalByCategories}
              colorScale={totalByCategories.map((category) => category.color)}
              style={{
                labels: {
                  fontSize: RFValue(18),
                  fontWeight: "bold",
                  fill: theme.colors.shape,
                },
              }}
              labelRadius={70}
              x="percent"
              y="total"
            />
          </ChartContainer>

          {totalByCategories.map((item) => (
            <HistoryCard
              key={item.key}
              title={item.name}
              amount={item.totalFormatted}
              color={item.color}
            />
          ))}
        </Content>
      )}
    </Container>
  );
}
