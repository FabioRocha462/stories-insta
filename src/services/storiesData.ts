import { faker } from "@faker-js/faker";
import { UserStory } from "../@types/userStory";
import { Story } from "../@types/story";

export const createStory = () => {
  const story: Story = {
    id: faker.number.int(100000),
    title: faker.lorem.slug(),
    imageUrl: faker.image.url(),
    text: faker.lorem.word(),
    is_visible: false,
    is_video: false,
    list_user_visible: [],
  };
  return story;
};
export const createStoryList = () => {
  return Array.from({ length: faker.number.int(10) }, createStory);
};

export const createUserStories = () => {
  const userStories: UserStory = {
    id: faker.number.int(100000),
    userImage: faker.image.url(),
    username: faker.person.firstName(),
    stories: createStoryList(),
  };
  return userStories;
};

export const createUserStoryList = async (length: number) => {
  return Array.from({ length: length }, createUserStories);
};
