import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Tarot, assets } from "./Tarot";

const index = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Tarot />
      </View>
    </GestureHandlerRootView>
  )
}

export default index

const styles = StyleSheet.create({})
