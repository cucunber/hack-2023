import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";
import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useLoading } from "../../hooks/useLoading";
import { useNavigate } from "react-router";

const schema = yup
  .object({
    username: yup.string().required(),
    password: yup.string().required(),
  })
  .required();

const AuthForm = observer(() => {
  const userStore = useStore((store) => store.userStore);
  const { loading, start, end } = useLoading();
  const navigator = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onBlur",
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    start();
    const error = await userStore.login(data);
    if (!error) {
      navigator("/");
    }
    end();
  });

  const disabledSubmit = Object.keys(errors).length !== 0;

  return (
    <VStack>
      <VStack spacing={5} sx={{ width: "100%" }} as="form" onSubmit={onSubmit}>
        <FormControl isRequired isInvalid={!!errors["username"]}>
          <FormLabel>Электронная почта</FormLabel>
          <Input {...register("username")} />
          {!!errors["username"] && (
            <FormErrorMessage>{errors["username"].message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isRequired isInvalid={!!errors["password"]}>
          <FormLabel>Пароль</FormLabel>
          <Input {...register("password")} type="password" />
          {!!errors["password"] && (
            <FormErrorMessage>{errors["password"].message}</FormErrorMessage>
          )}
        </FormControl>
        <Button
          sx={{ width: "200px" }}
          isDisabled={disabledSubmit}
          isLoading={loading}
          type="submit"
        >
          Войти
        </Button>
      </VStack>
      <Button
        sx={{ width: "200px" }}
        onClick={() => navigator("/register")}
        variant="outline"
      >
        Зарегистрироваться
      </Button>
    </VStack>
  );
});

const Auth = () => {
  return (
    <Box sx={{ width: "500px", margin: "40px auto" }}>
      <Heading sx={{ mb: "20px" }}>Вход</Heading>
      <Box>
        <AuthForm />
      </Box>
    </Box>
  );
};

export default Auth;
