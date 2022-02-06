import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = (size): number => (width / guidelineBaseWidth) * size;
const verticalScale = (size): number => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5): number =>
  size + (scale(size) - size) * factor;

export { scale, verticalScale, moderateScale };
