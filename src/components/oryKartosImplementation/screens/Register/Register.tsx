import React, { useContext, useEffect, useState } from "react";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  View,
  TouchableWithoutFeedback
} from "react-native";
import { Colors } from "../../../../styles/colors";
import { commonStyles } from "../../../../styles/commonStyles";
import { Fonts } from "../../../../styles/fonts";
import { Metrics } from "../../../../styles/metrics";
import { heightPercentageToDP } from "../../../../styles/widthHeightToDP";
import {
  SelfServiceRegistrationFlow,
  SubmitSelfServiceRegistrationFlowBody
} from "@ory/kratos-client";
import { AuthContext } from "../../provider/AuthProvider";
import { newKratosSdk } from "../../helpers/sdk";
import { useFocusEffect } from "@react-navigation/native";
import CustomStatusBar from "../../../common/CustomStatusBar";
import { ICONS, SVGIcon } from "../../../svg/SVGIcon";
import { moderateScale } from "../../../../styles/scaleUnits";
import fonts from "../../../../assets/fonts";
import Input from "../../../Input";
import { handleFormSubmitError } from "../../helpers/errorHandler";
import Loading from "../../../common/Loading";
import { Navigation, NavigatorParamList } from "../../../../constant/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { TextInput } from "react-native-paper";
import Button from "../../../Button";

const inputBorderColors = { colors: { text: Colors.white, placeholder: Colors.white, background: Colors.transparent } };

export interface RegisterOryKartosProps {
  navigation: StackNavigationProp<NavigatorParamList, Navigation.RegisterOryKartos>
}

function RegisterOryKartos({ navigation }: RegisterOryKartosProps): JSX.Element {
  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ loading, setLoading ] = useState(false);

  const [ flow, setConfig ] = useState<SelfServiceRegistrationFlow | undefined>(
    undefined
  );

  const { setSession, isAuthenticated } = useContext(AuthContext);

  const resetState = (): void => {
    setUsername("");
    setPassword("");
  };

  const initializeFlow = (): Promise<void> =>
    newKratosSdk()
      .initializeSelfServiceRegistrationFlowWithoutBrowser()
      // The flow was initialized successfully, let's set the form data:
      .then(({ data: flow }) => {
        setConfig(flow);
      })
      .catch(err => {
        alert(err);
      });

  useFocusEffect(
    React.useCallback(() => {
      initializeFlow();

      return () => {
        setConfig(undefined);
      };
    }, [])
  );

  useEffect(() => {
    if (isAuthenticated) {
      resetState();
      navigation.navigate(Navigation.HomeOryKartos);
    }
  }, [ isAuthenticated ]);

  if (isAuthenticated) {
    return null;
  }

  const onSubmit = (
    payload: SubmitSelfServiceRegistrationFlowBody
  ): Promise<void> =>
    flow
      ? newKratosSdk()
        .submitSelfServiceRegistrationFlow(flow.id, payload)
        .then(({ data }) => {
          if (!data.session_token || !data.session) {
            const err = new Error(
              "It looks like you configured ORY Kratos to not issue a session automatically\
               after registration. This edge-case is currently not supported in this example app. \
               You can find more information on enabling this \
               feature here: https://www.ory.sh/kratos/docs/next/self-service/flows/user-registration#successful-registration"
            );
            return Promise.reject(err);
          }
          return Promise.resolve({
            session: data.session,
            session_token: data.session_token
          });
        })
        .then(setSession)
        .catch(
          handleFormSubmitError<SelfServiceRegistrationFlow | undefined>(
            setConfig,
            initializeFlow
          )
        )
      : Promise.resolve();

  const onContinuePressed = async (): Promise<void> => {
    setLoading(true);
    await onSubmit({
      csrf_token: "",
      "traits.email": username,
      password: password,
      method: "password"
    }).then(() => setLoading(false));
  };
  return (
    <TouchableWithoutFeedback
      style={commonStyles.flex1}
      onPress={Keyboard.dismiss}
    >
      <View style={styles.container}>
        <Loading loading={loading} />
        <CustomStatusBar />
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.containerRounded}>
            <View style={styles.child}>
              <View style={styles.navBar}>
                <TouchableWithoutFeedback onPress={navigation.goBack}>
                  <SVGIcon
                    name={ICONS.IC_BACK_CIRCLE}
                    width={moderateScale(40)}
                    height={moderateScale(40)}
                  />
                </TouchableWithoutFeedback>
              </View>
              <Input
                value={username}
                onChangeText={setUsername}
                label={"Email address"}
                theme={inputBorderColors}
                inputStyles={styles.inputPadding}
                errorStyle={styles.errorTextStyle}
                activeUnderlineColor={Colors.white}
                underlineColor={Colors.white}
                errorMsg={flow?.ui?.nodes[1]?.messages[0]?.text}
                right={<TextInput.Icon style={styles.inputTextIconStyle} color={Colors.white} name="email-outline" />}
              />
              <Input
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                label={"Create a password"}
                theme={inputBorderColors}
                inputStyles={styles.inputPadding}
                errorStyle={styles.errorTextStyle}
                activeUnderlineColor={Colors.white}
                underlineColor={Colors.white}
                errorMsg={flow?.ui?.nodes[2]?.messages[0]?.text}
                right={<TextInput.Icon style={styles.inputTextIconStyle} color={Colors.white} name="lock-outline" />}
              />
            </View>
          </View>
          <View style={commonStyles.flex1Center}>
            <Button
              title="continue"
              onPress={onContinuePressed}
              disabled={username.length && password.length ? false : true}
              style={[ styles.buttonStyles, {
                backgroundColor: username.length && password.length ? Colors.black : Colors.baseDisabled
              } ]}
              contentStyle={styles.buttonContentStyles}
              labelStyle={styles.buttonLabelStyles}
            />
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default RegisterOryKartos;

const styles = StyleSheet.create({
  container: {
    ...commonStyles.flex1,
    backgroundColor: Colors.white
  },
  containerRounded: {
    ...commonStyles.containerRounded
  },
  child: {
    ...commonStyles.containerRoundedChild,
    paddingHorizontal: Metrics.padding.base,
    ...commonStyles.justifyCenter,
    ...commonStyles
  },
  navBar: {
    position: "absolute",
    top: 0,
    paddingHorizontal: Metrics.padding.base
  },
  inputPadding: {
    paddingHorizontal: 0,
    fontSize: Fonts.size.caption
  },
  errorTextStyle: {
    color: Colors.lightGrey,
    fontSize: Fonts.size.small,
    paddingHorizontal: 0 
  },
  inputTextIconStyle: {
    position: "absolute", 
    left: 0
  },
  buttonStyles: {
    borderRadius: moderateScale(40),
    paddingHorizontal: Metrics.padding.large,
    lineHeight: Fonts.size.caption + 5,
    fontWeight: Fonts.weight.w5,
    letterSpacing: 1,
    fontFamily: fonts.Poppins_Regular
  },
  buttonContentStyles: {
    height: heightPercentageToDP(7.2)
  },
  buttonLabelStyles: {
    color: Colors.white,
    fontSize: Fonts.size.caption
  }
});
