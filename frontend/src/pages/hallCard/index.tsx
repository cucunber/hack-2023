import { CircularProgress, Heading, VStack } from "@chakra-ui/react";
import { HallCard } from "../../widgets/card";
import { redirect, useNavigate, useParams } from "react-router";
import { useEffect } from "react";

export const HallCardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (id === undefined || Number.isNaN(parseInt(id))) redirect("/not-found");
  });
  if (!id) return <CircularProgress isIndeterminate />;
  return (
    <VStack sx={{ minH: "100vh", bg: "#0C1622" }} spacing={10}>
      <HallCard id={parseInt(id)} />
    </VStack>
  );
};
