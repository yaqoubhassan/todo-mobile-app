import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TodoList from "../screens/TodoList";
import TodoDetails from "../screens/TodoDetails";
import TodoForm from "../screens/TodoForm";

const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="TodoList">
      <Stack.Screen
        name="TodoList"
        component={TodoList}
        options={{ title: "Todos" }}
      />
      <Stack.Screen
        name="TodoDetails"
        component={TodoDetails}
        options={{ title: "Todo Details" }}
      />
      <Stack.Screen
        name="TodoForm"
        component={TodoForm}
        options={{ title: "Todo Form" }}
      />
    </Stack.Navigator>
  );
}
