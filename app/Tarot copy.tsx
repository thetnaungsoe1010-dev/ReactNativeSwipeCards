import { View, StyleSheet } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import {Card} from "./Card.tsx";

const cards = [
  {
    source: require("../assets/images/death.png"),
  },
  {
    source: require("../assets/images/chariot.png"),
  },
  {
    source: require("../assets/images/high-priestess.png"),
  },
  {
    source: require("../assets/images/justice.png"),
  },
  {
    source: require("../assets/images/lover.png"),
  },
  {
    source: require("../assets/images/pendu.png"),
  },
  {
    source: require("../assets/images/tower.png"),
  },
  {
    source: require("../assets/images/strength.png"),
  },
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