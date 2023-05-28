import { useCallback, useEffect, useState } from "react";
import { IHall } from "../../types/hall";
import { Heading, Spinner, VStack, Text } from "@chakra-ui/react";
import { hallAPI } from "../../api/hall";
import { useNavigate } from "react-router";
import { CreateHall } from "../createHall";

interface IEditHall {
  id: string;
}

export const EditHall = ({ id }: IEditHall) => {
  const navigator = useNavigate();
  const [hall, setHall] = useState<IHall | null>(null);

  useEffect(() => {
    const fetchHall = async () => {
      if (id) {
        const [error, data] = await hallAPI.getHallById(+id);
        if (error) {
          navigator("/not-found");
        } else {
          setHall(data);
        }
      }
    };
    fetchHall();
  }, [id, navigator]);

  const onSubmit = useCallback(
    async (body: FormData) => {
      const [error, data] = await hallAPI.patchHallById(+id, body);
      if (!error) {
        navigator(`/hall/${id}`);
        return;
      }
      alert(JSON.stringify(data));
    },
    [id, navigator]
  );

  if (!hall) {
    return <Spinner />;
  }

  return (
    <VStack>
      <Heading>Редактирование площадки</Heading>
      <Text>
        Заполните эту форму, чтобы вашим будущим клиентам было проще найти эту
        площадку
      </Text>
      <CreateHall initialState={hall} button="Сохранить" onSubmit={onSubmit} />
    </VStack>
  );
};
