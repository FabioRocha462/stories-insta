import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, { runOnJS } from "react-native-reanimated";
import { Story } from "../../@types/story";
import { UserStory } from "../../@types/userStory";
import IconClose from "../../assets/icon/IconClose.svg";
import defaultImageUser from "../../assets/images/defaultUserImage.png";
import { heightScreen, widthScreen } from "../../utils/consts/getDimensions";
import { ProgressBar } from "../ProgressBar";
import { StatusBar } from "expo-status-bar";
import { useDispatch } from "react-redux";
import { addViewInStory } from "../../store";

interface CardStoryProps {
  userStories: UserStory;
  stories: Story[];
  onClose: () => void;
  storyId: number;
}
export function CardStory({
  userStories,
  stories,
  onClose,
  storyId,
}: CardStoryProps) {
  const [indexStory, setIndexStory] = useState(0);
  const [isLongPress, setIsLongPress] = useState(false);
  const image = stories[indexStory]?.imageUrl;
  const dispath = useDispatch();
  const imageUser = userStories.userImage
    ? { uri: userStories.userImage }
    : defaultImageUser;
  const longPress = Gesture.LongPress()
    .minDuration(300)
    .onStart(() => {
      runOnJS(setIsLongPress)(true);
    })
    .onEnd(() => {
      runOnJS(setIsLongPress)(false);
    });
  const initializeStories = () => {
    if (stories.length > 0) {
      const countStoriesViews = stories.reduce((accumulator, currentValue) => {
        return accumulator + (currentValue.is_visible ? 1 : 0);
      }, 0);
      setIndexStory(() => {
        if (countStoriesViews < stories.length - 1) {
          return countStoriesViews;
        }
        return 0;
      });
    }
  };
  const getToNextStory = () => {
    if (stories) {
      setIndexStory((oldValue) => {
        if (oldValue < stories.length - 1) {
          if (!stories[oldValue].is_visible) {
            stories[oldValue].is_visible = true;
            const payload = {
              userId: userStories.id,
              storyId: stories[oldValue].id,
            };
            dispath(addViewInStory(payload));
          }
          return oldValue + 1;
        }
        if (!stories[oldValue].is_visible) {
          stories[oldValue].is_visible = true;
        }
        return 0;
      });
    }
  };

  const getToPrevStory = () => {
    if (stories) {
      setIndexStory((oldValue) => {
        if (oldValue === 0) {
          return stories.length - 1;
        } else {
          return oldValue - 1;
        }
      });
    }
  };

  useEffect(() => {
    initializeStories();
  }, [storyId]);

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={longPress}>
        <Animated.View style={{ width: widthScreen, height: heightScreen }}>
          <StatusBar style="light" />
          {stories && (
            <Image
              source={{ uri: image }}
              style={[{ width: "100%", height: "100%" }]}
              contentFit="fill"
            />
          )}
          <Pressable
            onPress={getToPrevStory}
            testID="prevStory"
            style={{ width: "30%", height: "100%", position: "absolute" }}
          />
          <Pressable
            onPress={getToNextStory}
            style={{
              width: "30%",
              height: "100%",
              right: 0,
              position: "absolute",
            }}
            testID="nextStory"
          />

          <View
            style={{
              position: "absolute",
              width: "100%",
              marginTop: 16,
              paddingLeft: 16,
              paddingRight: 16,

              gap: 8,
            }}
          >
            {stories && (
              <View
                style={{
                  width: "90%",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignSelf: "center",
                  gap: 2,
                }}
              >
                {stories.map((story, index) => {
                  return (
                    <ProgressBar
                      key={index}
                      isSelected={index === indexStory}
                      numberStories={stories.length}
                      isLongPress={isLongPress}
                      storyId={stories[indexStory].id}
                      is_watched={index < indexStory}
                      goToNextStory={getToNextStory}
                    />
                  );
                })}
              </View>
            )}
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={imageUser}
                  style={{ width: 35, height: 35, borderRadius: 999 }}
                />
                <Text style={{ color: "#FFFFFF", fontSize: 16 }}>
                  {userStories.username}
                </Text>
              </View>
              <TouchableOpacity onPress={onClose}>
                <IconClose stroke={"#fff"} width={36} height={36} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}
