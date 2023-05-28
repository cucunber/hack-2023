import { HStack, Heading, VStack, Text, Box, Image } from "@chakra-ui/react";
import { IHall } from "../../types/hall";
import { StarSVG } from "../../components/svg/star";
import { Link } from "react-router-dom";
import { getMediaUrl } from "../../utils/url";

interface IDescription {
  title: string;
  subtitle: string;
  value: string;
}

const Description = ({ title, subtitle, value }: IDescription) => {
  return (
    <VStack>
      <Text>{title}</Text>
      <Text>{subtitle}</Text>
      <Text>{value}</Text>
    </VStack>
  );
};

export const SmallCard = ({
  id,
  name,
  rating,
  avatar,
  media,
  area,
  price,
  unit,
  address,
  capacity,
}: Omit<IHall, "unit"> & { unit: string }) => {
  const avatar_ = avatar.file || media[0].file;
  return (
    <VStack sx={{ width: "500px" }} as={Link} to={`/hall/${id}/`}>
      <HStack>
        <Heading>{name}</Heading>
        <Box>
          <StarSVG />
          <Text>{rating}</Text>
        </Box>
      </HStack>
      <HStack>
        <Image src={getMediaUrl(avatar_)} alt="name" />
      </HStack>
      <HStack>
        <Description
          title="Вместимость"
          subtitle="(чел.)"
          value={`${capacity}`}
        />
        <Description
          title="Площадь"
          subtitle="(кв.м.)"
          value={`${area ?? "неизвестно"}`}
        />
        <Description
          title="Цена"
          subtitle={unit}
          value={`${price ?? "неизвестно"}`}
        />
      </HStack>
      {address && (
        <HStack>
          <Text>Адрес:</Text>
          <Text>{address}</Text>
        </HStack>
      )}
    </VStack>
  );
};
