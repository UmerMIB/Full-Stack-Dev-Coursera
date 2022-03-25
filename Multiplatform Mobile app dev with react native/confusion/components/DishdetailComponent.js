import React from "react";
import { Text, View, Image } from "react-native";
import { Card } from "react-native-elements";

function RenderDish(props) {
  const dish = props.dish;

  if (dish) {
    return (
      <Card>
        <Card.Title> {dish.name}</Card.Title>
        <Image source={require("../images/uthappizza.png")} />
        <Text stylse={{ margin: 10 }}>{dish.description}</Text>
      </Card>
    );
  }
}

function Dishdetail(props) {
  return (
    <View>
      <RenderDish dish={props.dish} />
    </View>
  );
}

export default Dishdetail;
