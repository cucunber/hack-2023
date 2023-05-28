import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  Text,
  Input,
  VStack,
  IconButton,
  Textarea,
  Popover,
  PopoverTrigger,
  PopoverBody,
  Box,
  HStack,
  PopoverContent,
  Checkbox,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { AddressInput } from "../../components/addressInput";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";
import { MultiSelect, SelectionVisibilityMode } from "chakra-multiselect";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { AddIcon, ChevronDownIcon, DeleteIcon } from "@chakra-ui/icons";
import { IProperty } from "../../types/property";
import { HallService } from "../../services/hall.service";

import { useDropzone } from "react-dropzone";
import { IHall } from "../../types/hall";

interface ISpecial {
  key: string;
  value: string;
  id: number;
}

const changeKey = (data: ISpecial[], id: number, key: string) => {
  const elementId = data.findIndex((elem) => elem.id === id);
  if (elementId === -1) {
    return data;
  }
  const newData = { ...data[elementId], key };
  return [...data.slice(0, elementId), newData, ...data.slice(elementId + 1)];
};

const changeValue = (data: ISpecial[], id: number, value: string) => {
  const elementId = data.findIndex((elem) => elem.id === id);
  if (elementId === -1) {
    return data;
  }
  const newData = { ...data[elementId], value };
  return [...data.slice(0, elementId), newData, ...data.slice(elementId + 1)];
};

const deleteElement = (data: ISpecial[], id: number) => {
  const elementId = data.findIndex((elem) => elem.id === id);
  if (elementId === -1) {
    return data;
  }
  return [...data.slice(0, elementId), ...data.slice(elementId + 1)];
};

const propertyMap = (property: string) => {
  if (property === "number") {
    return {
      component: Input,
    };
  }
  if (property === "bool") {
    return {
      component: Checkbox,
    };
  }
  return {
    component: Input,
  };
};

interface ICreateHall {
  onSubmit: (data: FormData) => void;
  button: string;
  initialState?: IHall;
}

export const CreateHall = observer(
  ({ onSubmit, button, initialState }: ICreateHall) => {
    const { hallTypes } = useStore((state) => state.hallStore);
    const { prices } = useStore((state) => state.priceStore);

    const mapHallType = useMemo(
      () =>
        hallTypes.map((hall) => ({
          value: hall.type_name,
          label: hall.type_name,
        })),
      [hallTypes]
    );

    const mapNameToId = useMemo(
      () =>
        hallTypes.reduce((acc, value) => {
          acc[value.type_name] = value.id;
          return acc;
        }, {} as any),
      [hallTypes]
    );

    const mapIdToName = useMemo(
      () =>
        hallTypes.reduce((acc, value) => {
          acc[value.id] = value.type_name;
          return acc;
        }, {} as any),
      [hallTypes]
    );

    const intState = useMemo(
      () => ({
        name: initialState?.name || "",
        descriptions: initialState?.descriptions || "",
        hall_type:
          initialState?.hall_type?.map((type) => mapIdToName[type]) || [],
        address: {
          value: initialState?.address || "",
          data: {
            geo_lat: initialState?.latitude || "",
            geo_lon: initialState?.longitude || "",
          },
        },
        conditions: [],
        area: initialState?.area || "",
        capacity: initialState?.capacity || "",
        price: initialState?.price || "",
        unit:
          prices.find((price) => price.id === initialState?.unit)?.unit_name ||
          "",
        phone: initialState?.phone || "",
        site: initialState?.site || "",
        vk: initialState?.vk || "",
        email: initialState?.email || "",
        telegram: initialState?.telegram || "",
        whatsapp: initialState?.whatsapp || "",
        services:
          Object.keys(initialState?.services || {}).map((key) => ({
            [key]: initialState?.services[key],
          })) || [],
        commonServices: [],
        media: [],
      }),
      [initialState, mapIdToName]
    );

    const specialId = useRef(0);
    const commonId = useRef(0);
    const { register, handleSubmit, control, watch, setValue } = useForm({
      defaultValues: intState,
    });

    const hallTypes_ = watch("hall_type");

    const media = watch("media");
    const conditions = watch("conditions");

    const [hallProperties, setHallProperties] = useState<IProperty[]>([]);
    const [selectedProperty, setSelectedProperty] = useState<IProperty | null>(
      null
    );

    const { getRootProps, getInputProps } = useDropzone({
      onDrop: (files) => setValue("media", files as any),
      accept: {
        "image/*": [".jpeg", ".png"],
        "video/*": [".mp4"],
      },
    });

    const { getRootProps: getRootProps2, getInputProps: getInputProps2 } =
      useDropzone({
        onDrop: (files) => setValue("conditions", files as any),
        accept: {
          "application/pdf": [".pdf"],
        },
      });

    useEffect(() => {
      setHallProperties([]);
      const hallTypesId = hallTypes_.map((hallType) => mapNameToId[hallType]);
      const promises = hallTypesId.map((id) =>
        HallService.getHallPropertiesById(id)
      );
      let newProperties = [] as IProperty[];
      Promise.allSettled(promises)
        .then((data) =>
          data.forEach((value) => {
            if (value.status === "fulfilled") {
              newProperties = [...newProperties, value.value as IProperty];
            }
          })
        )
        .finally(() => setHallProperties(newProperties));
    }, [hallTypes_, mapNameToId]);

    const handleFormSubmit = handleSubmit((data) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("descriptions", data.descriptions);
      data.hall_type
        .map((hallType) => mapNameToId[hallType])
        .forEach((id) => formData.append("hall_type", JSON.stringify(id)));
      formData.append("view_count", "0");
      formData.append("area_min", data.area);
      formData.append("area", data.area);
      formData.append("capacity", JSON.stringify(data.capacity));
      formData.append("address", data.address.value);
      formData.append("price_min", JSON.stringify(data.price));
      formData.append("price", JSON.stringify(data.price));
      formData.append(
        "unit",
        JSON.stringify(
          prices.find((price) => price.unit_name === `${data.unit}`)!.id
        )
      );
      formData.append("email", data.email);
      formData.append("longitude", data.address.data.geo_lon);
      formData.append("latitude", data.address.data.geo_lat);
      data.conditions.forEach((condition) =>
        formData.append("condition", condition)
      );
      formData.append("phone", data.phone);
      formData.append("site", data.site);
      formData.append("vk", data.vk);
      formData.append("telegram", data.telegram);
      formData.append("whatsapp", data.whatsapp);
      formData.append(
        `services`,
        JSON.stringify({
          ...data.commonServices.reduce((acc, value) => {
            // @ts-ignore
            acc[value.key] = value.value;
            return acc;
          }, {}),
          ...data.services.reduce((acc, value) => {
            // @ts-ignore
            acc[value.key] = value.value;
            return acc;
          }, {} as any),
        })
      );
      data.media.forEach((media) => formData.append("media", media));
      console.log(data, formData.values());
      onSubmit(formData);
    });

    return (
      <VStack
        spacing={8}
        sx={{ maxWidth: "600px", m: "0 auto" }}
        as="form"
        onSubmit={handleFormSubmit}
      >
        <VStack sx={{ width: "100%" }}>
          <FormControl isRequired>
            <FormLabel>Название площадки</FormLabel>
            <Input {...register("name")} />
          </FormControl>
          <FormControl>
            <FormLabel>Адрес</FormLabel>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <AddressInput
                  initialValue={field.value.value}
                  value={field.value}
                  setValue={(value) => field.onChange(value)}
                />
              )}
            />
          </FormControl>
        </VStack>
        <VStack sx={{ width: "100%" }}>
          <FormLabel>Параметры</FormLabel>
          <Grid
            gap={2}
            gridTemplateColumns={"1fr 1fr"}
            gridTemplateRows={"100px 1fr"}
          >
            <FormControl isRequired>
              <FormLabel>Вместимость (чел)</FormLabel>
              <Input {...register("capacity")} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Площадь (кв.м)</FormLabel>
              <Input {...register("area")} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Тип площадки</FormLabel>
              <Controller
                control={control}
                name="hall_type"
                render={({ field }) => (
                  <MultiSelect
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    multiple
                    selectionVisibleIn={SelectionVisibilityMode.List}
                    options={mapHallType}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <VStack sx={{ pt: 4, width: "100%" }}>
            <Text>Выбор параметров зависит от типа площадки</Text>
            <Controller
              control={control}
              name="commonServices"
              render={({ field }) => (
                <HStack spacing={4}>
                  <Button
                    isDisabled={
                      hallProperties.length === 0 || !selectedProperty
                    }
                    onClick={() =>
                      field.onChange([
                        ...field.value,
                        {
                          key: selectedProperty?.property_name,
                          value: "",
                          id: commonId.current++,
                        },
                      ])
                    }
                  >
                    <AddIcon />
                    <Text sx={{ ml: 2 }}>Добавить другие параметры</Text>
                  </Button>
                  <Popover>
                    <PopoverTrigger>
                      <Button
                        isDisabled={hallTypes_.length === 0}
                        leftIcon={<ChevronDownIcon />}
                      >
                        {selectedProperty
                          ? selectedProperty.property_name
                          : "Выберите свойство"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      {hallProperties.length !== 0 && (
                        <PopoverBody>
                          {hallProperties.map((property) => (
                            <Box
                              sx={{ cursor: "pointer", p: 2 }}
                              onClick={() => setSelectedProperty(property)}
                              key={property.id}
                            >
                              {property.property_name}
                            </Box>
                          ))}
                        </PopoverBody>
                      )}
                    </PopoverContent>
                  </Popover>
                </HStack>
              )}
            />
            <Controller
              control={control}
              name="commonServices"
              render={({ field }) => (
                <Grid
                  gap={4}
                  gridTemplateColumns={"1fr 1fr 40px"}
                  sx={{
                    py: 4,
                    width: "100%",
                    borderRadius: 8,
                    maxHeight: "200px",
                    overflowY: "auto",
                    overflowX: "hidden",
                  }}
                >
                  {field.value.map((element: ISpecial) => {
                    const { component: Component } = propertyMap(element.key);
                    return (
                      <Fragment key={element.id}>
                        <FormControl isRequired>
                          <FormLabel>Название параметра</FormLabel>
                          <Text>{element.key}</Text>
                        </FormControl>
                        <FormControl isRequired>
                          <FormLabel>Значение параметра</FormLabel>
                          <Component
                            value={element.value}
                            onChange={(val) =>
                              field.onChange(
                                changeValue(
                                  field.value,
                                  element.id,
                                  val.target.value
                                )
                              )
                            }
                          />
                        </FormControl>
                        <IconButton
                          aria-label=""
                          sx={{ mt: "auto" }}
                          onClick={() =>
                            field.onChange(
                              deleteElement(field.value, element.id)
                            )
                          }
                          icon={<DeleteIcon />}
                        />
                      </Fragment>
                    );
                  })}
                </Grid>
              )}
            />
          </VStack>
        </VStack>
        <VStack sx={{ width: "100%" }}>
          <FormControl isRequired>
            <FormLabel>Описание</FormLabel>
            <Textarea {...register("descriptions")} />
          </FormControl>
        </VStack>
        <VStack sx={{ width: "100%" }}>
          <Controller
            control={control}
            name="services"
            render={({ field }) => (
              <FormControl>
                <FormLabel sx={{ color: "transparent" }}>
                  Дополнительные услуги
                </FormLabel>
                <Button
                  sx={{ width: "100%" }}
                  onClick={() =>
                    field.onChange([
                      ...field.value,
                      { key: "", value: "", id: specialId.current++ },
                    ])
                  }
                >
                  <AddIcon />
                  <Text sx={{ ml: 2 }}>Добавить другие параметры</Text>
                </Button>
              </FormControl>
            )}
          />
        </VStack>
        <Controller
          control={control}
          name="services"
          render={({ field }) => (
            <Grid
              gap={4}
              gridTemplateColumns={"1fr 1fr 40px"}
              sx={{
                py: 4,
                width: "100%",
                borderRadius: 8,
                maxHeight: "200px",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              {field.value.map((element: any) => (
                <Fragment key={element.id}>
                  <FormControl isRequired>
                    <FormLabel>Название параметра</FormLabel>
                    <Input
                      value={element.key}
                      onChange={(val) =>
                        field.onChange(
                          // @ts-ignore
                          changeKey(field.value, element.id, val.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Значение параметра</FormLabel>
                    <Input
                      value={element.value}
                      onChange={(val) =>
                        field.onChange(
                          // @ts-ignore
                          changeValue(field.value, element.id, val.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <IconButton
                    aria-label=""
                    sx={{ mt: "auto" }}
                    onClick={() =>
                      // @ts-ignore
                      field.onChange(deleteElement(field.value, element.id))
                    }
                    icon={<DeleteIcon />}
                  />
                </Fragment>
              ))}
            </Grid>
          )}
        />
        <VStack sx={{ width: "100%" }}>
          <Grid
            sx={{ pt: 4, width: "100%" }}
            gap={2}
            templateColumns={"1fr 1fr"}
          >
            <FormControl isRequired>
              <FormLabel>Цена</FormLabel>
              <Input {...register("price")} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Формат цены</FormLabel>
              <Controller
                control={control}
                name="unit"
                render={({ field }) => (
                  <MultiSelect
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    single
                    selectionVisibleIn={SelectionVisibilityMode.List}
                    options={prices.map((value) => ({
                      label: value.unit_name,
                      value: value.unit_name,
                    }))}
                  />
                )}
              />
            </FormControl>
          </Grid>
        </VStack>
        <VStack sx={{ width: "100%" }}>
          <Grid sx={{ width: "100%" }} gap={2} templateColumns={"1fr 1fr"}>
            <FormControl>
              <FormLabel>Сайт</FormLabel>
              <Input {...register("site")} />
            </FormControl>
            <FormControl>
              <FormLabel>Вк</FormLabel>
              <Input {...register("vk")} />
            </FormControl>
            <FormControl>
              <FormLabel>Телефон</FormLabel>
              <Input {...register("phone")} />
            </FormControl>
            <FormControl>
              <FormLabel>Whatsapp</FormLabel>
              <Input {...register("whatsapp")} />
            </FormControl>
            <FormControl>
              <FormLabel>Телеграм</FormLabel>
              <Input {...register("telegram")} />
            </FormControl>
          </Grid>
        </VStack>
        <VStack sx={{ width: "100%" }}>
          <FormControl isRequired>
            <FormLabel>Медиафайлы</FormLabel>
            <Box
              sx={{
                width: "100%",
                height: "100px",
                p: 2,
                border: "1px solid grey",
                borderRadius: 4,
              }}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {media.length === 0 ? (
                <Text>
                  Выберите или перетащите файлы, которые хотите загрузить
                </Text>
              ) : (
                media.map((value: File) => value.name).join(",")
              )}
            </Box>
          </FormControl>
        </VStack>
        <VStack sx={{ width: "100%" }}>
          <FormControl>
            <FormLabel>Условия пользования площадкой</FormLabel>
            <Box
              sx={{
                width: "100%",
                height: "100px",
                p: 2,
                border: "1px solid grey",
                borderRadius: 4,
              }}
              {...getRootProps2()}
            >
              <input {...getInputProps2()} />
              {conditions.length === 0 ? (
                <Text>
                  Выберите или перетащите файлы, которые хотите загрузить
                </Text>
              ) : (
                conditions.map((value: File) => value.name).join(", ")
              )}
            </Box>
          </FormControl>
        </VStack>
        <Button type="submit">{button}</Button>
      </VStack>
    );
  }
);
