import {
  Box,
  Button,
  CircularProgress,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  Image,
  Spacer,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FC, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { IFile, IHall, IHallType } from "../../types/hall";
import { hallAPI } from "../../api/hall";
import { observe, toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";
import { Navigation, Thumbs } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import s from "./index.module.css";
import clsx from "clsx";

interface IHallCard {
  id: number;
}

const baseURL = "http://95.163.233.126:8000";

export const HallCard: FC<IHallCard> = observer(({ id }) => {
  const [hall, setHall] = useState<IHall>();
  const [hallType, setHallType] = useState<string[]>([]);
  const [images, setImages] = useState<IFile[]>([]);

  const [thumbsSwiper, setThumbsSwiper] = useState();
  const [activeSlide, setActiveSlide] = useState(0);

  const getHallTypeById = useStore((store) =>
    store.hallStore.getHallTypeById.bind(store.hallStore)
  );
  const getHall = useCallback(async () => {
    if (id) {
      const [error, data] = await hallAPI.getHallById(id);

      if (!error) {
        setHall(data);
        setImages(data.media);
      }
    }
  }, [hall, hallType]);
  useEffect(() => {
    if (hall !== undefined) {
      const arrayOfTypes = hall.hall_type;
      if (arrayOfTypes)
        setHallType(
          arrayOfTypes.map((typeId) => {
            return getHallTypeById(typeId);
          })
        );
    }
  }, [hall]);
  useEffect(() => {
    getHall();
  }, []);
  if (!hall || !hallType || !images)
    return <CircularProgress isIndeterminate />;

  return (
    <Container maxW="container.lg">
      <VStack w="100%">
        <Heading
          fontSize="40px"
          color="white"
          alignSelf="flex-start"
          maxW="450px"
        >
          {hall.name}
        </Heading>
        <Button bg="#E74362" color="white" alignSelf="flex-start" w="330px">
          забронировать даты
        </Button>
        <Box w="100%" h="800px">
          <Swiper
            modules={[Navigation, Thumbs]}
            navigation
            thumbs={{ swiper: thumbsSwiper }}
            onSlideChange={(e) => setActiveSlide(e.activeIndex)}
          >
            {hall.media.map((img) => (
              <SwiperSlide>
                <Image src={`${baseURL}${img.file}`} height="600px" w="100%" />
              </SwiperSlide>
            ))}
          </Swiper>
          <Swiper
            onSwiper={(e) => setThumbsSwiper}
            loop={false}
            loopedSlides={1}
            spaceBetween={10}
            slidesPerView={4}
            freeMode={false}
            watchSlidesProgress={true}
            className={s.mySwiper}
          >
            {hall.media.map((img, index) => (
              <SwiperSlide>
                <Image
                  src={`${baseURL}${img.file}`}
                  height="200px"
                  w="100%"
                  className={clsx({ [s.activeSlide]: activeSlide === index })}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
        <Flex w="100%">
          <Grid
            maxW="320px"
            w="100%"
            templateColumns="repeat(2, 1fr)"
            templateRows="repeat(2, 3fr) 1fr"
            gap="20px"
          >
            <GridItem
              colSpan={1}
              rowSpan={1}
              bg={"#17283F"}
              borderRadius="5px"
              p="10px"
            >
              <Box>
                <VStack>
                  <Box textAlign="center">
                    <Text color="#FFFFFF" fontSize="18px" lineHeight="23px">
                      вместимость
                    </Text>
                    <Text
                      m="0px"
                      color="#4F7083"
                      fontSize="18px"
                      lineHeight="23px"
                    >
                      (чел.)
                    </Text>
                  </Box>
                  <Text fontSize="2xl" fontWeight={700} color="#E74362">
                    {hall.capacity}
                  </Text>
                </VStack>
              </Box>
            </GridItem>
            <GridItem
              colSpan={1}
              rowSpan={1}
              bg={"#17283F"}
              borderRadius="5px"
              p="10px"
            >
              <Box>
                <VStack>
                  <Box textAlign="center">
                    <Text color="#FFFFFF">площадь</Text>
                    <Text color="#4F7083">(кв.м.)</Text>
                  </Box>
                  <Text fontSize="2xl" fontWeight={700} color="#E74362">
                    {hall.area}
                  </Text>
                </VStack>
              </Box>
            </GridItem>
            <GridItem
              colSpan={2}
              rowSpan={1}
              bg={"#17283F"}
              p="10px"
              borderRadius="5px"
            >
              <Text color="#FFFFFF" fontSize="18px" lineHeight="23px">
                Тип помещения
              </Text>
              {hallType.map((tag) => (
                <Tag
                  key={tag}
                  borderRadius="17px"
                  bg="transparent"
                  color="#E74362"
                  border="1px solid #E74362"
                >
                  {tag}
                </Tag>
              ))}
            </GridItem>
            <GridItem
              colSpan={2}
              rowSpan={1}
              bg={"#17283F"}
              p="10px"
              borderRadius="5px"
            >
              <Text color="#FFFFFF" fontSize="18px" lineHeight="23px">
                Дополнительные услуги
              </Text>
            </GridItem>
          </Grid>
          <Spacer />
          <Grid gap="20px" maxW="320px" w="100%" templateRows="3fr 1fr 3fr">
            <GridItem bg={"#17283F"} p="15px" borderRadius="5px">
              <Text color="#FFFFFF" fontSize="18px" lineHeight="23px">
                Адрес:
              </Text>
              <Text
                color="#FFFFFF"
                fontSize="18px"
                lineHeight="23px"
                textAlign="center"
              >
                {hall.address}
              </Text>
            </GridItem>
            <GridItem>
              <Button
                w="100%"
                variant="outline"
                borderColor="#E74362"
                color="#E74362"
              >
                Показать на карте
              </Button>
            </GridItem>
            <GridItem
              bg={"#17283F"}
              p="10px"
              borderRadius="5px"
              w="100%"
              flex="1 1 auto"
            >
              <Text color="#FFFFFF" fontSize="18px" lineHeight="23px">
                Контакты:
              </Text>
              <Text color="#FFFFFF" fontSize="18px" lineHeight="23px">
                {hall.site}
              </Text>
              <Text color="#FFFFFF" fontSize="18px" lineHeight="23px">
                {hall.phone}
              </Text>
            </GridItem>
          </Grid>
          <Spacer />
          <Box
            color="#FFFFFF"
            fontSize="18px"
            lineHeight="23px"
            bg={"#17283F"}
            p="10px"
            borderRadius="5px"
            h="auto"
          >
            <HStack>
              <Text
                color="#fff"
                fontSize="30px"
                lineHeight="38px"
                alignSelf="flex-start"
              >
                Стоимость:
              </Text>
              <VStack>
                <Text
                  color="#E74362"
                  fontSize="50px"
                  lineHeight="63px"
                  fontWeight={700}
                >
                  {hall.price}
                </Text>{" "}
                <Text
                  color="#fff"
                  fontSize="30px"
                  lineHeight="38px"
                  fontWeight={700}
                >
                  руб/час
                </Text>
              </VStack>
            </HStack>
          </Box>
        </Flex>
        <Box color="#FFFFFF" fontSize="18px" lineHeight="23px">
          {hall.descriptions}
        </Box>
        <Flex w="100%">
          <VStack w="100%" maxW="320px">
            <Button w="100%" bg="#17283F" color="#fff">
              {hall.rating} Отзывы({hall.comments.length})
            </Button>
            <Button
              w="100%"
              variant="outline"
              borderColor="#E74362"
              color="#E74362"
            >
              Оставить отзыв
            </Button>
          </VStack>
          <Spacer />
          <VStack w="100%" maxW="320px">
            <Button w="100%" bg="#E74362" color="white" alignSelf="flex-start">
              Забронировать даты
            </Button>
            <Button
              w="100%"
              variant="outline"
              borderColor="#E74362"
              color="#E74362"
            >
              Добавить в избранное
            </Button>
            <Button
              w="100%"
              variant="outline"
              borderColor="#E74362"
              color="#E74362"
            >
              Связаться с владельцем
            </Button>
          </VStack>
        </Flex>
      </VStack>
    </Container>
  );
});
