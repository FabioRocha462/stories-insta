import { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { UserStory } from "../../@types/userStory";
import ModalStories, { ModalProps } from "../ModalStories";
import { StorySVG } from "../StorySVG";
import { styles } from "./styles";
import { useDispatch } from "react-redux";
import { initialArray, useAppSelector } from "../../store";

type CircleViewProps = {
  userStoryCurrent: UserStory;
  allUserStorys: UserStory[];
};
export function CircleView({
  userStoryCurrent,
  allUserStorys,
}: CircleViewProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const refModalStories = useRef<ModalProps>();
  const handleVisibleModal = () => {
    setIsModalVisible(true);
    setTimeout(() => {
      refModalStories.current?.openModal();
    }, 300);
  };

  const stories = userStoryCurrent.stories ? userStoryCurrent.stories : [];
  const contStoriesVisibility = () => {
    if (stories?.length) {
      const contViws = stories.reduce((accumulator, currentValue) => {
        return accumulator + (currentValue.is_visible ? 1 : 0);
      }, 0);

      return contViws;
    }
    return 0;
  };

  return (
    <View>
      <TouchableOpacity style={styles.viewImage} onPress={handleVisibleModal}>
        <StorySVG
          image={userStoryCurrent.userImage}
          size={60}
          storiesCount={
            userStoryCurrent.stories?.length
              ? userStoryCurrent.stories.length
              : 1
          }
          viewedStories={contStoriesVisibility()}
        />
        <Text style={styles.userNameTitle}>{userStoryCurrent.username}</Text>
      </TouchableOpacity>
      {isModalVisible && (
        <ModalStories
          userStories={allUserStorys}
          userStory={userStoryCurrent}
          ref={refModalStories}
          onClose={() => {
            setIsModalVisible(false);
          }}
        />
      )}
    </View>
  );
}
