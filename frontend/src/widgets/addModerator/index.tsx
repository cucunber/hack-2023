import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { userAPI } from "../../api/user";

const schema = yup
  .object({
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup
      .string()
      .required()
      .min(8)
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*;:'"-_]).{8,}$/,
        "Minimum eight characters, at least one letter, one number and one special character"
      ),
  })
  .required();

export const AddModerator = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
    },
    mode: "onChange",
    reValidateMode: "onBlur",
    resolver: yupResolver(schema),
  });

  const handleFormSubmit = handleSubmit(async (values) => {
    const [error, data] = await userAPI.createUser({
      ...values,
      inn: "0000000000",
      username: values.email,
      user_agreement: true,
      offer_agreement: true,
      show_phone_number: false,
      phone_number: "00000000000",
      interest: [],
      job_title: "moderator",
      organization: "this",
      // @ts-ignore
      is_staff: true,
    });
    if (!error) {
      alert("Модератор успешно создан");
    } else {
      alert(JSON.stringify(data));
    }
  });

  return (
    <VStack sx={{ width: "100%" }} as="form" onSubmit={handleFormSubmit}>
      <FormControl isRequired isInvalid={!!errors["first_name"]}>
        <FormLabel>Имя</FormLabel>
        <Input {...register("first_name")} />
        <FormErrorMessage>{errors["first_name"]?.message}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={!!errors["last_name"]}>
        <FormLabel>Фамилиия</FormLabel>
        <Input {...register("last_name")} />
        <FormErrorMessage>{errors["last_name"]?.message}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={!!errors["email"]}>
        <FormLabel>Почта</FormLabel>
        <Input {...register("email")} />
        <FormErrorMessage>{errors["email"]?.message}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={!!errors["password"]}>
        <FormLabel>Пароль</FormLabel>
        <Input {...register("password")} type="password" />
        <FormErrorMessage>{errors["password"]?.message}</FormErrorMessage>
      </FormControl>
      <Button type="submit">Добавить модератора</Button>
    </VStack>
  );
};
