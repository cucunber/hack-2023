import { Heading, Text, VStack } from "@chakra-ui/react";
import { CreateHall } from "../../widgets/createHall";
import { useCallback } from "react";
import { useNavigate } from "react-router";
import { hallAPI } from "../../api/hall";

export const CreateHallPage = () => {
  const navigator = useNavigate();
  const handleCreate = useCallback(
    async (body: FormData) => {
      const [error, data] = await hallAPI.postHall(body);
      if (error) {
        alert(JSON.stringify(data));
        return;
      }
      const { id } = data;
      navigator(`/hall/${id}`);
    },
    [navigator]
  );
  return (
    <VStack>
      <Heading>Создание вашей площадки</Heading>
      <Text>
        Заполните эту форму, чтобы вашим будущим клиентам было проще найти эту
        площадку
      </Text>
      <CreateHall button="Создать площадку" onSubmit={handleCreate} />
    </VStack>
  );
};
