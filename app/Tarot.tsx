import { View, StyleSheet } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import {Card} from "./Card.tsx";

const cards = [
  {
    source: require("../assets/images/P1.jpg"),
  },
  {
    source: require("../assets/images/P2.jpg"),
  },
  {
    source: require("../assets/images/P3.jpg"),
  },
  {
    source: require("../assets/images/P4.jpg"),
  },
  {
    source: require("../assets/images/P5.jpg"),
  },
  {
    source: require("../assets/images/P6.jpg"),
  }

];


export const assets = cards.map((card) => card.source);

export const Tarot = () => {
  const shuffleBack = useSharedValue(false);
  return (
    <View style={styles.container}>
      {cards.map((card, index) => (
        <Card card={card} key={index} index={index} shuffleBack={shuffleBack} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightblue",
  },
});