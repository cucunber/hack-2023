import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { dadataInstance } from "../../config/api";
import { debounce } from "lodash";
import {
  Box,
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";

interface ISuggest {
  value: string;
  data: {
    geo_lat: string;
    geo_lon: string;
  };
}

interface IInputSelect {
  value: ISuggest;
  setValue: (value: ISuggest) => void;
  initialValue?: string,
}

export const AddressInput = ({ value, setValue, initialValue }: IInputSelect) => {
  const [options, setOptions] = useState<ISuggest[]>([]);
  const debounceSearch = useMemo(
    () =>
      debounce(async (value: string) => {
        const { data } = await dadataInstance.post<{ suggestions: ISuggest[] }>(
          "/",
          {
            query: value,
          }
        );
        setOptions(data.suggestions);
      }, 400),
    []
  );

  const opt = useMemo(
    () => options.map((opt_) => ({ label: opt_.value, value: opt_.value })),
    [options]
  );

  const [s, setS] = useState(initialValue);

  const handleSelect = useCallback(
    (value: string) => () => {
      setS(value);
      const selectedElement = options.find((elem) => elem.value === value);
      if (selectedElement) {
        setValue(selectedElement);
      }
    },
    [options, setValue]
  );

  const handleValueChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value: v } = e.target;
    setS(v);
  };

  useEffect(() => {
    if (s) {
      debounceSearch(s);
    }
  }, [debounceSearch, s]);

  const initialFocusRef = useRef<HTMLInputElement>(null);

  return (
    <Popover initialFocusRef={initialFocusRef}>
      <PopoverTrigger>
        <Input ref={initialFocusRef} value={s} onChange={handleValueChange} />
      </PopoverTrigger>
      <PopoverContent>
        {opt.length !== 0 && (
          <PopoverBody>
            {opt.map((option) => (
              <Box sx={{ py: 2, px: 1, cursor: "pointer" }} onClick={handleSelect(option.value)} key={option.value}>
                {option.value}
              </Box>
            ))}
          </PopoverBody>
        )}
      </PopoverContent>
    </Popover>
  );
};
