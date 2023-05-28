import { Link as RouterLink } from "react-router-dom";
import { Link as UILink } from "@chakra-ui/react";
import { ComponentProps } from "react";

type TLink = ComponentProps<typeof RouterLink> &
  Omit<ComponentProps<typeof UILink>, "as">;

export const Link = (props: TLink) => <UILink as={RouterLink} {...props} />;
