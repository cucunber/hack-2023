import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { hallAPI } from "../../api/hall";
import { IHall } from "../../types/hall";
import { HStack, Input, VStack, Text, Button, Heading } from "@chakra-ui/react";
import { debounce } from "lodash";
import { Link } from "../../components/link";

export const ModerateHalls = () => {
  const [notModerated, setNotModerated] = useState<IHall[]>([]);
  const [search, setSearch] = useState("");

  const handleSearch = useCallback(async () => {
    const [error, data] = await hallAPI.getHall({
      hall_name: search,
      moderated: 1,
    });
    if (!error) {
      setNotModerated(data.results);
    }
  }, [search]);

  const debounceSearch = useMemo(
    () => debounce(handleSearch, 400),
    [handleSearch]
  );

  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const { value } = event.target;
      setSearch(value);
      debounceSearch();
    },
    [debounceSearch]
  );

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const handleSubmit = useCallback(
    (hall: IHall, moderation: number, index: number) => async () => {
      const formData = new FormData();
      formData.append("moderated", JSON.stringify(moderation));
      const [error, data] = await hallAPI.patchHallById(hall.id, formData);
      if (!error) {
        setNotModerated([
          ...notModerated.slice(0, index),
          ...notModerated.slice(index + 1),
        ]);
        return;
      }
      alert(JSON.stringify(data));
    },
    [notModerated]
  );

  return (
    <VStack sx={{ width: "100%" }}>
      <Input placeholder="Поиск" value={search} onChange={handleSearchChange} />

      {notModerated.length === 0 && (
        <Heading key="empty" size="md">
          Нет площадков
        </Heading>
      )}
      {notModerated.length !== 0 && (
        <VStack
          key="search"
          sx={{
            width: "700px",
            height: "500px",
            overflowX: "hidden",
            overflowY: "auto",
          }}
          justifyContent="space-between"
          spacing={4}
        >
          <HStack sx={{ width: "100%" }}>
            <Text sx={{ flex: "0 0 200px" }}>Название площадки</Text>
            <Text sx={{ flex: "0 0 100px" }}>Ссылка на площадку</Text>
            <Text sx={{ flex: "0 0 100px" }}>Ссылка на чат</Text>
          </HStack>
          {notModerated.map((hall, index) => (
            <HStack sx={{ width: "100%" }} key={hall.id}>
              <Text sx={{ flex: "0 0 200px" }}>{hall.name}</Text>
              <Link sx={{ flex: "0 0 100px" }} to={`/hall/${hall.id}/`}>
                Просмотреть площадку
              </Link>
              <Link sx={{ flex: "0 0 100px" }} to={`/chats?to=${hall.id}`}>
                Связаться с площадкой
              </Link>
              <Button
                colorScheme="green"
                sx={{ flex: "0 0 100px" }}
                onClick={handleSubmit(hall, 2, index)}
              >
                Принять
              </Button>
              <Button
                colorScheme="red"
                sx={{ flex: "0 0 150px" }}
                onClick={handleSubmit(hall, 3, index)}
              >
                Заблокировать
              </Button>
            </HStack>
          ))}
        </VStack>
      )}
    </VStack>
  );
};
