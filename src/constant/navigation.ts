export enum Navigation {
  Login = "Login",
  Welcome = "Welcome",
  WelcomeBack = "WelcomeBack",
  PageScroll = "PageScroll",
  TabNavigator = "TabNavigator",
  FetchGoogleOtherInfo = "FetchGoogleOtherInfo",
  FetchGooglePersonalInfo = "FetchGooglePersonalInfo",
  AnalyseData = "AnalyseData",
  Pwned = "Pwned",
  Connect = "Connect",
  Notifications = "Notifications",
  FetchGoogleDataAndPrivacy = "FetchGoogleDataAndPrivacy",
  HomeOryKartos = "HomeOryKartos",
  RegisterOryKartos = "RegisterOryKartos",
  LoginOryKartos = "LoginOryKartos",
  OryKartosIntro = "OryKartosIntro"
}

export type NavigatorParamList = {
  [Navigation.RegisterOryKartos]: undefined,
  [Navigation.LoginOryKartos]: undefined,
  [Navigation.OryKartosIntro]: undefined,
  [Navigation.HomeOryKartos]: undefined
}
