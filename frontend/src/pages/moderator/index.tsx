import { Heading, VStack } from "@chakra-ui/react";
import { ModerateHalls } from "../../widgets/moderate";
import { AddModerator } from "../../widgets/addModerator";

export const Moderator = () => {
  return (
    <VStack sx={{ maxWidth: "1000px", margin: '0 auto' }} spacing={10}>
      <VStack sx={{ width: "100%" }} spacing={10}>
        <Heading size="lg" sx={{ alignSelf: "flex-end" }}>
          Профили площадок на модерацию
        </Heading>
        <ModerateHalls />
      </VStack>
      <VStack sx={{ width: "80%" }} spacing={10}>
        <Heading size="lg" sx={{ alignSelf: "flex-end" }}>
          Добавить модератора
        </Heading>
        <AddModerator />
      </VStack>
    </VStack>
  );
};
