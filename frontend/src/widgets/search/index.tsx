import { useCallback, useEffect, useMemo, useState } from "react";
import { hallAPI } from "../../api/hall";
import { IHall, IHallType, Limits } from "../../types/hall";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";
import {
  Checkbox,
  Grid,
  HStack,
  RangeSlider,
  VStack,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  FormControl,
  FormLabel,
  Tooltip,
  Button,
} from "@chakra-ui/react";
import Calendar from "react-calendar";
import { LooseValue } from "react-calendar/dist/cjs/shared/types";

import "react-calendar/dist/Calendar.css";
import { debounce } from "lodash";
import { useSearchParams } from "react-router-dom";
import { SmallCard } from "../smallCard";

export const Search = observer(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [limits, setLimits] = useState<Limits>({
    min_area: parseFloat(searchParams.get("min_area") || "0"),
    max_area: parseFloat(searchParams.get("max_area") || "0"),
    min_capacity: parseFloat(searchParams.get("min_capacity") || "0"),
    max_capacity: parseFloat(searchParams.get("max_capacity") || "0"),
    min_price: parseFloat(searchParams.get("min_price") || "0"),
    max_price: parseFloat(searchParams.get("max_price") || "0"),
  });

  const hallType = useStore((state) => state.hallStore.hallTypes);
  const units = useStore((state) => state.priceStore.prices);
  const [dateRange, setDateRange] = useState<LooseValue>(
    [] as unknown as LooseValue
  );

  const [halls, setHalls] = useState<IHall[]>([]);
  const [selectedHallTypes, setSelectedHallTypes] = useState<IHallType[]>(
    () => {
      const params = searchParams.get("hall_type");
      if (!params) {
        return [];
      }
      const ids = params.split("").map((id) => +id);
      return hallType.filter((hall) => ids.includes(hall.id));
    }
  );
  const [areaRange, setAreaRange] = useState<number[]>([
    limits.min_area,
    limits.max_area,
  ]);
  const [capacityRange, setCapacityRange] = useState<number[]>([
    limits.min_capacity,
    limits.max_capacity,
  ]);
  const [priceRange, setPriceRange] = useState<number[]>([
    limits.min_price,
    limits.max_price,
  ]);

  const handleToggleHallType = useCallback(
    (hall: IHallType) => () => {
      const selectedId = selectedHallTypes.findIndex(
        (element) => element === hall
      );
      if (selectedId === -1) {
        setSelectedHallTypes([...selectedHallTypes, hall]);
        return;
      }
      setSelectedHallTypes([
        ...selectedHallTypes.slice(0, selectedId),
        ...selectedHallTypes.slice(selectedId + 1),
      ]);
    },
    [selectedHallTypes]
  );

  const getFilteredData = useCallback(async () => {
    const hallTypeIds = selectedHallTypes.map((hallType) => hallType.id);
    const selectedDateRange = (dateRange as Date[]).length === 2;
    const requestBody = {
      area_from: areaRange[0] || limits.min_area,
      area_till: areaRange[1] || limits.max_area,
      capacity_from: capacityRange[0] || limits.min_capacity,
      capacity_till: capacityRange[1] || limits.max_capacity,
      price_from: priceRange[0] || limits.min_price,
      price_till: capacityRange[1] || limits.max_price,
      ...(hallTypeIds.length !== 0 && { hall_type: hallTypeIds.join(",") }),
      ...(selectedDateRange && {
        // @ts-ignore
        order_from: new Date(dateRange[0]).toISOString().split("T")[0],
        // @ts-ignore
        order_till: new Date(dateRange[1]).toISOString().split("T")[0],
      }),
    };
    setSearchParams(JSON.stringify(requestBody));
    const [error, data] = await hallAPI.getHall({
      ...requestBody,
      moderated: 2,
    });
    if (!error) {
      setHalls(data.results);
    } else {
      alert(JSON.stringify(data));
    }
  }, [
    areaRange,
    capacityRange,
    dateRange,
    limits.max_area,
    limits.max_capacity,
    limits.max_price,
    limits.min_area,
    limits.min_capacity,
    limits.min_price,
    priceRange,
    selectedHallTypes,
    setSearchParams,
  ]);

  useEffect(() => {
    const fetchLimits = async () => {
      const [error, data] = await hallAPI.getFilteredHall();
      if (!error) {
        setLimits(data);
      }
    };
    fetchLimits();
  }, []);

  const priceUnitMap = useMemo(
    () =>
      units.reduce((acc, unit) => {
        acc[unit.id] = unit.unit_name;
        return acc;
      }, {} as Record<number, string>),
    [units]
  );

  const calendarDefaultValues = useMemo(() => {
    const order_from = searchParams.get("order_from");
    const order_till = searchParams.get("order_till");
    if (order_from && order_till) {
      return [new Date(order_from), new Date(order_till)];
    }
    return [];
  }, [searchParams]);

  return (
    <HStack>
      <VStack>
        <Grid gridTemplateColumns={"1fr 1fr"}>
          {hallType.map((type) => (
            <Checkbox onChange={handleToggleHallType(type)} key={type.id}>
              {type.type_name}
            </Checkbox>
          ))}
        </Grid>
        <VStack>
          <FormControl>
            <FormLabel>Площадь (кв.м.)</FormLabel>
            <RangeSlider
              defaultValue={[limits.min_area, limits.max_area]}
              onChangeEnd={setAreaRange}
              min={limits.min_area}
              max={limits.max_area}
            >
              <RangeSliderTrack>
                <RangeSliderFilledTrack />
              </RangeSliderTrack>
              <Tooltip label={areaRange[0]}>
                <RangeSliderThumb index={0} />
              </Tooltip>
              <Tooltip label={areaRange[1]}>
                <RangeSliderThumb index={1} />
              </Tooltip>
            </RangeSlider>
          </FormControl>
          <FormControl>
            <FormLabel>Вместимость (чел.)</FormLabel>
            <RangeSlider
              defaultValue={[limits.min_capacity, limits.max_capacity]}
              onChangeEnd={setCapacityRange}
              min={limits.min_capacity}
              max={limits.max_capacity}
            >
              <RangeSliderTrack>
                <RangeSliderFilledTrack />
              </RangeSliderTrack>
              <Tooltip label={capacityRange[0]}>
                <RangeSliderThumb index={0} />
              </Tooltip>
              <Tooltip label={capacityRange[1]}>
                <RangeSliderThumb index={1} />
              </Tooltip>
            </RangeSlider>
          </FormControl>
          <FormControl>
            <FormLabel>Цена</FormLabel>
            <RangeSlider
              defaultValue={[limits.min_price, limits.max_price]}
              onChangeEnd={setPriceRange}
              min={limits.min_price}
              max={limits.max_price}
            >
              <RangeSliderTrack>
                <RangeSliderFilledTrack />
              </RangeSliderTrack>
              <Tooltip label={priceRange[0]}>
                <RangeSliderThumb index={0} />
              </Tooltip>
              <Tooltip label={priceRange[1]}>
                <RangeSliderThumb index={1} />
              </Tooltip>
            </RangeSlider>
          </FormControl>
        </VStack>
        <Calendar
          defaultValue={calendarDefaultValues as LooseValue}
          selectRange
          value={dateRange}
          onChange={setDateRange}
        />
        <Button onClick={getFilteredData}>Найти</Button>
      </VStack>
      <VStack>
        {halls.map((hall) => (
          <SmallCard key={hall.id} {...hall} unit={priceUnitMap[hall.unit]} />
        ))}
      </VStack>
    </HStack>
  );
});
