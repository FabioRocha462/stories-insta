import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { useDispatch } from "react-redux";
import { UserStory } from "../../@types/userStory";
import { createUserStoryList } from "../../services/storiesData";
import { CircleView } from "../CircleView";
import { styles } from "./styles";

export function slideCircleView() {
  const [userStories, setStories] = useState<UserStory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchUserStories = async () => {
    setIsLoading(true);
    const fetchedStories = await createUserStoryList(30);
    setStories(fetchedStories);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUserStories();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={userStories}
        renderItem={({ item }) => (
          <CircleView userStoryCurrent={item} allUserStorys={userStories} />
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
        refreshing={isLoading}
        onRefresh={fetchUserStories}
      />
    </View>
  );
}

export default slideCircleView;
