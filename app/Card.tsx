import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions, Image, ImageSourcePropType, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { snapPoint } from "react-native-redash";

// Get the width and height of the screen
const { width: wWidth, height: wHeight } = Dimensions.get("window");

// Define the snap points for the card
const SNAP_POINTS = [-wWidth, 0, wWidth];

// Define the width and height of the card
const CARD_WIDTH = wWidth * 0.9;
const CARD_HEIGHT = wHeight * 0.7;

// Define the duration of the animation
const DURATION = 250;

// Define the threshold for swipe to show text
const SWIPE_THRESHOLD = 100; // Adjust this value as needed

// Props for the card component
interface CardProps {
  card: {
    source: ReturnType<typeof require>;
  };
  shuffleBack: Animated.SharedValue<boolean>;
  index: number;
}

// Card component
export const Card = ({ card: { source }, shuffleBack, index }: CardProps) => {
  const offset = useSharedValue({ x: 0, y: 0 });
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotateZ = useSharedValue(0);
  const delay = index * DURATION;
  const swipeDirection = useSharedValue(""); // New shared value for swipe direction
  const likedStampOpacity = useSharedValue(0); // Opacity for the liked stamp
  const notLikedStampOpacity = useSharedValue(0); // Opacity for the not liked stamp

  // When the card is mounted, animate it to the original position
  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withTiming(0, { duration: DURATION, easing: Easing.inOut(Easing.ease) })
    );
  }, [delay, translateY]);

  // When the gesture ends, shuffle back to the original position
  useAnimatedReaction(
    () => shuffleBack.value,
    (v) => {
      if (v) {
        translateX.value = withDelay(
          150 * index,
          withSpring(0, {}, () => {
            shuffleBack.value = false;
            likedStampOpacity.value = 0; // Reset liked stamp opacity
            notLikedStampOpacity.value = 0; // Reset not liked stamp opacity
          })
        );
      }
    }
  );

  // Swipe animation
  const gesture = Gesture.Pan()
    // When the gesture starts, set the offset to the current position
    .onBegin(() => {
      offset.value = { x: translateX.value, y: translateY.value };
      likedStampOpacity.value = 0; // Reset opacity when swipe begins
      notLikedStampOpacity.value = 0; // Reset opacity when swipe begins
    })
    // Update the position and scale based on the translation
    .onUpdate(({ translationX }) => {
      translateX.value = offset.value.x + translationX;
      scale.value = 1 + Math.abs(translationX) / (wWidth * 4);
      rotateZ.value = (translationX / wWidth) * 20;
      translateY.value = -Math.abs(translationX) / 15;

      // Update the stamp opacity based on swipe direction
      if (translationX > SWIPE_THRESHOLD) {
        swipeDirection.value = "Liked";
        likedStampOpacity.value = 1; // Show the liked stamp
        notLikedStampOpacity.value = 0; // Hide the not liked stamp
      } else if (translationX < -SWIPE_THRESHOLD) {
        swipeDirection.value = "Not Liked";
        notLikedStampOpacity.value = 1; // Show the not liked stamp
        likedStampOpacity.value = 0; // Hide the liked stamp
      } else {
        swipeDirection.value = "";
        likedStampOpacity.value = 0; // Hide both stamps
        notLikedStampOpacity.value = 0; // Hide both stamps
      }
    })
    // When the gesture ends, snap to a new position based on the velocity
    .onEnd(({ velocityX }) => {
      const dest = snapPoint(translateX.value, velocityX, SNAP_POINTS);
      translateX.value = withSpring(dest, { velocity: velocityX });
      translateY.value = withSpring(0);
      scale.value = withTiming(1);
      rotateZ.value = withTiming(0);
      
      // Reset opacity if not swiped beyond threshold
      if (dest === 0) {
        likedStampOpacity.value = 0; // Reset liked stamp opacity
        notLikedStampOpacity.value = 0; // Reset not liked stamp opacity
      }

      if (dest !== 0) {
        shuffleBack.value = true;
      }
    });

  // Animated style for the card
  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotateZ: `${rotateZ.value}deg` },
    ],
  }));

  // Animated style for the liked stamp
  const likedStampStyle = useAnimatedStyle(() => ({
    opacity: likedStampOpacity.value,
  }));

  // Animated style for the not liked stamp
  const notLikedStampStyle = useAnimatedStyle(() => ({
    opacity: notLikedStampOpacity.value,
  }));

  return (
    <View style={styles.container} pointerEvents="box-none">
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.card, style]}>
          <Image
            source={source as ImageSourcePropType}
            style={{
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
            }}
            resizeMode="cover"
          />
          <Animated.View style={[styles.likedStamp, likedStampStyle]}>
            <Text style={styles.stampText}>Liked</Text>
          </Animated.View>
          <Animated.View style={[styles.notLikedStamp, notLikedStampStyle]}>
            <Text style={styles.stampText}>Not Liked</Text>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

// Styles for the card
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 0.5,
  },
  likedStamp: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: 5,
    borderWidth: 2,
    borderColor: "red",
    backgroundColor: "transparent",
    borderRadius: 5,
  },
  notLikedStamp: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
    borderWidth: 2,
    borderColor: "red",
    backgroundColor: "transparent",
    borderRadius: 5,
  },
  stampText: {
    color: "red",
    fontWeight: "bold",
  },
});