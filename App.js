import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Modal } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import HomeScreen from "./src/components/HomeScreen";
import HowMeldWorks from "./src/components/HowMeldWorks";
import StaticPageScroller from "./src/components/StaticPageScroller";
import AnalyseScreen from "./src/components/AnalyseScreen";
import FetchGoogleActivityData from "./src/modules/FetchGoogleActivityData/sources/FetchGoogleActivityData";
import FetchGooglePersonalInfo from "./src/modules/FetchGoogleActivityData/sources/FetchGooglePersonalInfo";
import FetchGoogleDataAndPrivacy from "./src/modules/FetchGoogleActivityData/sources/FetchGoogleDataAndPrivacy";
import DataCollected from "./src/modules/FetchGoogleActivityData/DataCollected";
import FetchGoogleOtherInfo from "./src/modules/FetchGoogleActivityData/sources/FetchGoogleOtherInfo";
import AnalyseData from "./src/modules/AnalyseData";
import TabNavigator from "./src/components/TabMenu/TabNavigator";
import WelcomeScreen from "./src/components/welcomeBackScreen";
import FilterScreen from "./src/components/filterScreen";
import Settings from "./src/components/TabMenu/Settings";
import Notifications from "./src/components/TabMenu/Notifications";
import Connect from "./src/components/TabMenu/Connect";
import { MenuProvider } from "react-native-popup-menu";
import Insights from "./src/modules/Insights";
import Pwned from "./src/modules/Pwned";
import { EventRegister } from "react-native-event-listeners";
import RegisterOryKartos from "./src/components/oryKartosImplementation/screens/Register/Register";
import LoginOryKartos from "./src/components/oryKartosImplementation/screens/Login/Login";
import HomeOryKartos from "./src/components/oryKartosImplementation/screens/Home";
import AuthProvider from "./src/components/oryKartosImplementation/provider/AuthProvider";
import Intro from "./src/components/oryKartosImplementation/screens/Intro";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Colors } from "./src/styles/colors";
const Stack = createStackNavigator();

const App = () => {

  const [ modalVisible, setModalVisible ] = useState(false);

  let listener;

  useEffect(() => {
    listener = EventRegister.addEventListener("openOverLay", (isShowModal) => {
      setModalVisible(isShowModal);

    });
    return () => EventRegister.removeEventListener(listener);
  });

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: Colors.white,
      background:Colors.white
    }
  };

  return (
    <SafeAreaProvider>
      <MenuProvider>
        <AuthProvider>
          <NavigationContainer theme={MyTheme}>
            <Stack.Navigator initialRouteName="Home" screenOptions={{
              headerShown: false,
              gestureEnabled: false
            }}>
              <Stack.Screen name="OryKartosIntro" component={Intro} />
              <Stack.Screen name="RegisterOryKartos" component={RegisterOryKartos} />
              <Stack.Screen name="LoginOryKartos" component={LoginOryKartos} />
              <Stack.Screen name="HomeOryKartos" component={HomeOryKartos} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="HowMeld" component={HowMeldWorks} />
              <Stack.Screen name="PageScroll" component={StaticPageScroller} />
              <Stack.Screen name="Login" component={FetchGoogleActivityData} />
              <Stack.Screen name="FetchGooglePersonalInfo" component={FetchGooglePersonalInfo} />
              <Stack.Screen name="FetchGoogleDataAndPrivacy" component={FetchGoogleDataAndPrivacy} />
              <Stack.Screen name="FetchGoogleOtherInfo" component={FetchGoogleOtherInfo} />
              <Stack.Screen name="DataCollected" component={DataCollected} />
              <Stack.Screen name="Analyze" component={AnalyseScreen} />
              <Stack.Screen name="WelcomeBack" component={WelcomeScreen} />
              <Stack.Screen name="Filter" component={FilterScreen} />
              <Stack.Screen name="AnalyseData" component={AnalyseData} />
              <Stack.Screen name="TabNavigator" component={TabNavigator} />
              <Stack.Screen name="Insights" component={Insights} />
              <Stack.Screen name="Pwned" component={Pwned} />
              <Stack.Screen name="Settings" component={Settings} />
              <Stack.Screen name="Notifications" component={Notifications} />
              <Stack.Screen name="Connect" component={Connect} />
            </Stack.Navigator>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
            >
              <AnalyseScreen />
            </Modal>
          </NavigationContainer>
        </AuthProvider>
      </MenuProvider>
    </SafeAreaProvider>
  );
};

export default App;