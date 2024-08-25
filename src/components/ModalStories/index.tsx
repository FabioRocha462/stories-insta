import {
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { View, FlatList, Dimensions, Text } from "react-native";
import Modal from "react-native-modal";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { UserStory } from "../../@types/userStory";
import { heightScreen, widthScreen } from "../../utils/consts/getDimensions";
import { getIsIOS } from "../../utils/consts/getPlataform";
import { CardStory } from "../CardStory";
import { styles } from "./styles";
type ModalImagesStoryProps = {
  userStory: UserStory;
  userStories: UserStory[];
  onClose?: () => void;
};
type AnimatePageProps = {
  index: number;
  pageIndex: SharedValue<number>;
  children: ReactNode;
};
export interface ModalProps {
  openModal: () => void;
  closeModal: () => void;
}

const { width } = Dimensions.get("screen");

export default forwardRef(function ModalStories(
  { userStory, userStories, onClose }: ModalImagesStoryProps,
  ref
) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userCurrentStories, setUserCurrentStories] = useState<UserStory>(
    {} as UserStory
  );
  const [indexCurrent, setIndexCurrent] = useState(0);
  const isIOS = getIsIOS;
  const refFlatList = useRef<FlatList<UserStory>>(null);
  const [prevMoviment, setPrevMoviment] = useState(0);

  const perspective = 1000;
  const pageIndex = useSharedValue(0);

  const AnimatePage = ({ index, pageIndex, children }: AnimatePageProps) => {
    const animatedStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * width,
        index * width,
        (index + 1) * width,
      ];
      const rotateY = interpolate(
        pageIndex.value,
        inputRange,
        [90, 0, -90],
        "clamp"
      );

      return {
        flex: 1,
        transform: [{ perspective }, { rotateY: `${rotateY}deg` }],
      };
    }, [index]);
    return (
      <Animated.View key={index} style={[animatedStyle]}>
        {children}
      </Animated.View>
    );
  };
  const renderItem = ({ item, index }: { item: UserStory; index: number }) => {
    return (
      <AnimatePage index={index} pageIndex={pageIndex}>
        <CardStory
          userStories={item}
          stories={item.stories ? item.stories : []}
          onClose={closeModal}
          storyId={item.id}
        />
      </AnimatePage>
    );
  };
  const openModal = () => {
    setIsModalVisible(true);
    const index = userStories.indexOf(userStory);
    setIndexCurrent(index);
    setUserCurrentStories(userStory);
    setPrevMoviment(Math.round(index * width));
  };

  const closeModal = () => {
    setIsModalVisible(false);
    onClose?.();
  };

  useImperativeHandle(ref, () => {
    return { openModal, closeModal };
  });

  const scrollToNextIndex = (index: number) => {
    try {
      refFlatList.current?.scrollToIndex({ index: index + 1, animated: true });
      setIndexCurrent((oldValue) => {
        if (oldValue < userStories.length - 1) {
          return oldValue + 1;
        }
        return 0;
      });
    } catch (error) {
      return error;
    }
  };
  const scrollToPrevIndex = (index: number) => {
    try {
      refFlatList.current?.scrollToIndex({ index: index - 1, animated: true });
      setIndexCurrent((oldValue) => {
        if (oldValue > 0) {
          return oldValue - 1;
        }
        return 0;
      });
    } catch (error) {
      return error;
    }
  };
  return (
    <View style={styles.ContainerModal}>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={closeModal}
        hideModalContentWhileAnimating
        animationIn="zoomIn"
        animationInTiming={400}
        animationOutTiming={500}
        deviceHeight={widthScreen}
        deviceWidth={heightScreen}
        useNativeDriver={!isIOS}
        style={{
          marginTop: 0,
          marginBottom: 0,
          marginLeft: 0,
          marginRight: 0,
          backgroundColor: "#000",
        }}
        backdropOpacity={1}
      >
        <View style={styles.Container}>
          <FlatList
            data={userStories}
            bounces={false}
            keyExtractor={(item) => String(item.id)}
            initialScrollIndex={indexCurrent}
            pagingEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={(event) =>
              (pageIndex.value = Math.round(event.nativeEvent.contentOffset.x))
            }
            onScrollEndDrag={(event) => {
              const position = Math.round(event.nativeEvent.contentOffset.x);
              if (position > prevMoviment) {
                setIndexCurrent((oldValue) => {
                  if (oldValue < userStories.length - 1) {
                    return oldValue + 1;
                  }
                  return 0;
                });
              } else {
                setIndexCurrent((oldValue) => {
                  if (oldValue > 0) {
                    return oldValue - 1;
                  }
                  return 0;
                });
              }
              setPrevMoviment(position);
            }}
            ref={refFlatList}
            getItemLayout={(userStories, index) => ({
              length: widthScreen,
              offset: widthScreen * index,
              index,
            })}
            onScrollToIndexFailed={(info) => {
              const wait = new Promise((resolve) => setTimeout(resolve, 500));
              wait.then(() => {
                refFlatList.current?.scrollToIndex({
                  index: info.index,
                  animated: true,
                });
              });
            }}
            renderItem={renderItem}
          />
        </View>
      </Modal>
    </View>
  );
});
