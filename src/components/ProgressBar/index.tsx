import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { widthScreen } from "../../utils/consts/getDimensions";
interface ProgressBarProps {
  isSelected: boolean;
  numberStories: number;
  is_watched: boolean;
  isLongPress: boolean;
  storyId?: number;
  goToNextStory: () => void;
}
const widthCalc = widthScreen - 36;
let NUMBER_SECONDS_OF_STORIES = 15 * 1000;
export function ProgressBar({
  isSelected,
  numberStories,
  is_watched,
  isLongPress,
  storyId,
  goToNextStory,
}: ProgressBarProps) {
  const widthProgress = useSharedValue<number>(0);
  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    width: `${widthProgress.value * 100}%`,
  }));

  useEffect(() => {
    widthProgress.value = 0;
  }, [storyId]);
  useAnimatedReaction(
    () => widthProgress.value,
    (currentValue, previousValue) => {
      if (currentValue !== previousValue && currentValue === 1 && isSelected) {
        runOnJS(goToNextStory)();
      }
    }
  );
  useEffect(() => {
    if (!isLongPress) {
      widthProgress.value = withTiming(1, {
        duration: NUMBER_SECONDS_OF_STORIES,
        easing: Easing.linear,
      });
    } else {
      widthProgress.value = withTiming(1, {
        duration: NUMBER_SECONDS_OF_STORIES * (1 - widthProgress.value),
      });
    }
  }, [isLongPress, storyId]);

  useEffect(() => {
    if (isLongPress) {
      cancelAnimation(widthProgress);
    }
  }, [isLongPress]);

  return (
    <View
      style={{
        width: widthCalc / numberStories,
        height: 2,
        borderRadius: 5,
        backgroundColor: "#808080",
      }}
    >
      {isSelected ? (
        <Animated.View
          style={[
            { height: 2, backgroundColor: "#FFF" },
            indicatorAnimatedStyle,
          ]}
        />
      ) : (
        <View
          style={{
            width: widthCalc / numberStories,
            height: 2,
            opacity: is_watched ? 1 : 0.3,
            backgroundColor: "#FFF",
          }}
        />
      )}
    </View>
  );
}
