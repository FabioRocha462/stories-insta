import { useSelector, TypedUseSelectorHook } from "react-redux";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { UserStory } from "../@types/userStory";
import { Story } from "../@types/story";

interface UserStories extends Array<UserStory> {}

const findUser = (users: UserStory[], userId: number) => {
  const userFind = users.find((user) => user.id === userId);
  return userFind;
};

const findStory = (stories: Story[], storyId: number) => {
  const storyFind = stories.find((story) => story.id === storyId);
  return storyFind;
};

const initialState: UserStories = [];

const userStoriesSlice = createSlice({
  name: "userStories",
  initialState,
  reducers: {
    initialArray: (state, action) => {
      state = action.payload;
      return state;
    },
    addViewInStory: (state, action) => {
      const payload = action.payload;
      const user = findUser(state, payload.userId);
      if (user?.stories) {
        const story = findStory(user.stories, payload.storyId);
        if (story) {
          story.is_visible = true;
          const index = user.stories.indexOf(story);
          user.stories[index] = story;
          const indexUser = state.indexOf(user);
          state[indexUser] = user;
        }
      }
    },
  },
});
export const store = configureStore({
  reducer: {
    userStories: userStoriesSlice.reducer,
  },
});

export const { initialArray, addViewInStory } = userStoriesSlice.actions;
export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
