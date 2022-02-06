import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard
} from "react-native";
import { Colors } from "../../../../styles/colors";
import { commonStyles } from "../../../../styles/commonStyles";
import { Fonts } from "../../../../styles/fonts";
import { Metrics } from "../../../../styles/metrics";
import { heightPercentageToDP } from "../../../../styles/widthHeightToDP";
import { moderateScale } from "../../../../styles/scaleUnits";
import { AuthContext } from "../../provider/AuthProvider";
import {
  SelfServiceLoginFlow,
  SubmitSelfServiceLoginFlowBody
} from "@ory/kratos-client";
import { newKratosSdk } from "../../helpers/sdk";
import { SessionContext } from "../../helpers/auth";
import { useFocusEffect } from "@react-navigation/native";
import { handleFormSubmitError } from "../../helpers/errorHandler";
import Loading from "../../../common/Loading";
import CustomStatusBar from "../../../common/CustomStatusBar";
import { ICONS, SVGIcon } from "../../../svg/SVGIcon";
import Input from "../../../Input";
import fonts from "../../../../assets/fonts";
import ErrorSheet from "../../../common/ErrorSheet/ErrorSheet";
import { LoginOryKartosProps } from "./Login.types";
import { TextInput } from "react-native-paper";
import Button from "../../../Button";

const inputBorderColors = { colors: { text: Colors.white, placeholder: Colors.white, background: Colors.transparent } };

function LoginOryKartos({ navigation, route }: LoginOryKartosProps): JSX.Element {
  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ loading, setLoading ] = useState(false);
  const [ showError, setShowError ] = useState(false);
  const [ flow, setFlow ] = useState<SelfServiceLoginFlow | undefined>(undefined);

  const { setSession, isAuthenticated, sessionToken } = useContext(AuthContext);

  const initializeFlow = (): Promise<void> =>
    newKratosSdk()
      .initializeSelfServiceLoginFlowWithoutBrowser(
        route?.params?.refresh,
        route?.params?.aal,
        sessionToken
      )
      .then(response => {
        const { data: flow } = response;
        setFlow(flow);
      })
      .catch(err => {
        alert(JSON.stringify(err));
      });

  useFocusEffect(
    React.useCallback(() => {
      initializeFlow();

      return () => {
        setFlow(undefined);
      };
    }, [])
  );

  useEffect(() => {
    if (flow?.ui?.messages?.length) {
      setShowError(true);
    }
  }, [ flow ]);

  useEffect(() => {
    if (isAuthenticated) {
      navigation.navigate("HomeOryKartos");
    }
  }, [ isAuthenticated ]);

  if (isAuthenticated) {
    return null;
  }

  const onSubmit = (payload: SubmitSelfServiceLoginFlowBody): Promise<void> =>
    flow
      ? newKratosSdk()
        .submitSelfServiceLoginFlow(flow.id, sessionToken, payload)
        .then(({ data }) => Promise.resolve(data as SessionContext))
        .then(session => {
          setSession(session);
          setUsername("");
          setPassword("");
        })
        .catch(handleFormSubmitError(setFlow, initializeFlow))
      : Promise.resolve();

  const onContinuePressed = async (): Promise<void> => {
    setLoading(true);
    await onSubmit({
      csrf_token: "",
      password_identifier: username,
      password: password,
      method: "password"
    }).then(() => setLoading(false));
  };

  const hideErrorSheet = (): void => setShowError(!showError);
  return (
    <TouchableWithoutFeedback
      style={commonStyles.flex1}
      onPress={Keyboard.dismiss}
    >
      <View style={styles.container}>
        <Loading loading={loading} />
        <ErrorSheet
          showErrorSheet={showError}
          errorTitle={"Invalid Credentials"}
          errorText={
            flow?.ui?.messages?.length ? flow?.ui?.messages[0]?.text : ""
          }
          hideErrorSheet={hideErrorSheet}
        />
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
                label={"Password"}
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
              title="login"
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

export default LoginOryKartos;

const styles = StyleSheet.create({
  container: {
    ...commonStyles.flex1
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
