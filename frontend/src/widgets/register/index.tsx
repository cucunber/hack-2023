import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Input,
  Link,
  Radio,
  RadioGroup,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCallback, useState } from "react";
import { useStore } from "../../hooks/useStore";
import { IUser } from "../../types/user";
import { useLoading } from "../../hooks/useLoading";
import { useNavigate } from "react-router";

const schema = yup
  .object({
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    email: yup.string().email().required(),
    phone_number: yup.string().required(),
    password: yup
      .string()
      .required()
      .min(8)
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*;:'"-_]).{8,}$/,
        "Minimum eight characters, at least one letter, one number and one special character"
      ),
    confirm_password: yup
      .string()
      .required()
      .oneOf([yup.ref("password")], "Passwords must match"),
    offer_agreement: yup.boolean().isTrue(),
    user_agreement: yup.boolean().isTrue(),
  })
  .required();

const companyScheme = yup.object({
  job_title: yup.string().required(),
  organization: yup.string().required(),
  inn: yup
    .string()
    .required()
    .test("len", "Неверный ИНН", (value) => [10, 12].includes(value.length)),
});

interface IBaseRegistrationForm {
  onSubmit: (
    data: Pick<
      IUser,
      | "first_name"
      | "last_name"
      | "email"
      | "phone_number"
      | "offer_agreement"
      | "user_agreement"
    > & { password: string }
  ) => void;
  loading: boolean;
}

export const BaseRegistrationForm = ({
  onSubmit,
  loading,
}: IBaseRegistrationForm) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      password: "",
      confirm_password: "",
      offer_agreement: false,
      user_agreement: false,
    },
    resolver: yupResolver(schema),
  });

  const onFromSubmit = handleSubmit(onSubmit);

  return (
    <Box sx={{ width: "500px" }} as="form" onSubmit={onFromSubmit}>
      <Stack direction="column">
        <FormControl isRequired isInvalid={!!errors["first_name"]}>
          <FormLabel>Имя</FormLabel>
          <Input {...register("first_name")} />
          {errors["first_name"] && (
            <FormErrorMessage>{errors["first_name"].message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isRequired isInvalid={!!errors["last_name"]}>
          <FormLabel>Фамилия</FormLabel>
          <Input {...register("last_name")} />
          {errors["last_name"] && (
            <FormErrorMessage>{errors["last_name"].message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isRequired isInvalid={!!errors["email"]}>
          <FormLabel>Электронная почта</FormLabel>
          <Input {...register("email")} />
          {errors["email"] && (
            <FormErrorMessage>{errors["email"].message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isRequired isInvalid={!!errors["phone_number"]}>
          <FormLabel>Телефон</FormLabel>
          <Input {...register("phone_number")} />
          {errors["phone_number"] && (
            <FormErrorMessage>
              {errors["phone_number"].message}
            </FormErrorMessage>
          )}
        </FormControl>
        <FormControl isRequired isInvalid={!!errors["password"]}>
          <FormLabel>Пароль</FormLabel>
          <Input {...register("password")} type="password" />
          {errors["password"] && (
            <FormErrorMessage>{errors["password"].message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isRequired isInvalid={!!errors["confirm_password"]}>
          <FormLabel>Повторите пароль</FormLabel>
          <Input {...register("confirm_password")} type="password" />
          {errors["confirm_password"] && (
            <FormErrorMessage>
              {errors["confirm_password"].message}
            </FormErrorMessage>
          )}
        </FormControl>
      </Stack>
      <Stack sx={{ pt: 4 }}>
        <FormControl>
          <Checkbox {...register("user_agreement")}>
            Я подтверждаю ознакомление и согласие с{" "}
            <Link>Пользовательским соглашением</Link>,
            <Link>Политикой обработки персональных данных</Link>
          </Checkbox>
        </FormControl>
        <FormControl>
          <Checkbox {...register("offer_agreement")}>
            Я подтверждаю ознакомление и согласие с{" "}
            <Link>Публичной офертой</Link>
          </Checkbox>
        </FormControl>
      </Stack>
      <Button sx={{ mt: 10 }} isLoading={loading} type="submit">
        Зарегистрироваться
      </Button>
    </Box>
  );
};

interface ICompanyForm {
  onSubmit: (data: Pick<IUser, "inn" | "organization" | "job_title">) => void;
  loading: boolean;
}

const CompanyForm = ({ onSubmit, loading }: ICompanyForm) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onBlur",
    resolver: yupResolver(companyScheme),
    defaultValues: {
      job_title: "",
      organization: "",
      inn: "",
    },
  });

  const onFormSubmit = handleSubmit(onSubmit);

  return (
    <Box sx={{ width: "500px" }} as="form" onSubmit={onFormSubmit}>
      <Stack>
        <FormControl isRequired isInvalid={!!errors["job_title"]}>
          <FormLabel>Ваша должность</FormLabel>
          <Input {...register("job_title")} />
          {errors["job_title"] && (
            <FormErrorMessage>{errors["job_title"].message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isRequired isInvalid={!!errors["organization"]}>
          <FormLabel>Название юридического лица</FormLabel>
          <Input {...register("organization")} />
          {errors["organization"] && (
            <FormErrorMessage>
              {errors["organization"].message}
            </FormErrorMessage>
          )}
        </FormControl>
        <FormControl isRequired isInvalid={!!errors["inn"]}>
          <FormLabel>Ваш ИНН</FormLabel>
          <Input {...register("inn")} />
          {errors["inn"] && (
            <FormErrorMessage>{errors["inn"].message}</FormErrorMessage>
          )}
        </FormControl>
      </Stack>
      <Button sx={{ mt: 10 }} type="submit" isLoading={loading}>
        Перейти на сайт
      </Button>
    </Box>
  );
};

const useRegistration = () => {
  const registerService = useStore((state) => state.userStore.registerService);
  const profileService = useStore((state) => state.profileStore.profileService);

  const { loading, start, end } = useLoading();

  const createUser = useCallback(
    async (data: Omit<IUser, "id">) => {
      start();
      const request = await registerService.register(data);
      end();
      return request;
    },
    [end, registerService, start]
  );

  const createCompanyUser = useCallback(
    async (id: string, data: any) => {
      start();
      const request = await profileService.updateProfile(id, data);
      end();
      return request;
    },
    [end, profileService, start]
  );

  return {
    createUser,
    createCompanyUser,
    loading,
  };
};

const User = () => {
  const { createUser, loading } = useRegistration();
  const navigator = useNavigate();

  const handleSubmit = async (data: any) => {
    const [error, result] = await createUser({
      ...data,
      username: data.email,
      interest: [],
    });
    if (!error) {
      navigator("/login");
      return;
    }
    alert(JSON.stringify(result));
  };

  return <BaseRegistrationForm onSubmit={handleSubmit} loading={loading} />;
};

const Company = () => {
  const { createUser, createCompanyUser, loading } = useRegistration();
  const navigator = useNavigate();
  const [step, setStep] = useState(0);
  const [userId, setUserId] = useState(0);
  const handleSubmitUser = async (data: any) => {
    const [error, response] = await createUser({
      ...data,
      username: data.email,
      interest: [],
    });
    if (!error) {
      setStep(1);
      setUserId(response.id);
      return;
    }
    alert(JSON.stringify(response));
  };
  const handleSubmitCompany = async (data: any) => {
    const error = await createCompanyUser(`${userId}`, data);
    navigator("/login");
  };
  if (step === 0) {
    return (
      <BaseRegistrationForm onSubmit={handleSubmitUser} loading={loading} />
    );
  }
  return <CompanyForm onSubmit={handleSubmitCompany} loading={loading} />;
};

const forms = [<User />, <Company />];

export const Register = () => {
  const [userType, setUserType] = useState("0");

  return (
    <VStack sx={{ p: 10 }} spacing={10}>
      <Heading sx={{ textAlign: 'start', width: "500px" }}>
        Регистрация
      </Heading>
      <Stack alignItems="center">
        <Stack>
          <RadioGroup onChange={setUserType} value={userType}>
            <HStack spacing={5}>
              <Radio value="0">Арендатор</Radio>
              <Radio value="1">Арендодатель</Radio>
            </HStack>
          </RadioGroup>
        </Stack>
        {forms[+userType]}
      </Stack>
    </VStack>
  );
};
