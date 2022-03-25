import React from "react";
import { View, Text } from "react-native";
import { FlatList } from "react-native";
import { ListItem, Avatar, Icon } from "react-native-elements";

function Menu(props) {
  const renderMenuItem = ({ item, index }) => {
    return (
      <ListItem
        key={index}
        bottomDivider
        onPress={() => props.onPress(item.id)}
      >
        <Avatar source={require("../images/uthappizza.png")} />
        <ListItem.Content>
          <ListItem.Title>{item.name}</ListItem.Title>
          <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    );
  };

  return (
    <FlatList
      data={props.dishes}
      renderItem={renderMenuItem}
      keyExtractor={(item) => item.id.toString()}
    />
  );
}

export default Menu;
