import { Route, Routes, useNavigate, useParams } from "react-router";
import { useStore } from "../../hooks/useStore";
import {
  Fragment,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLoading } from "../../hooks/useLoading";
import {
  Box,
  Grid,
  HStack,
  Heading,
  Spinner,
  VStack,
  Text,
} from "@chakra-ui/react";
import { Link } from "../../components/link";
import { IHall } from "../../types/hall";
import { AddIcon } from "@chakra-ui/icons";
import { SmallCard } from "../../widgets/smallCard";
import { observer } from "mobx-react-lite";
import { Moderator } from "../moderator";

const OwnerContext = createContext({ is_owner: false });
const useOwner = () => useContext(OwnerContext);

interface IMyHalls {
  halls: IHall[];
}

const MyHalls = observer(({ halls }: IMyHalls) => {
  const priceById = useStore((state) =>
    state.priceStore.priceById.bind(state.profileStore)
  );
  const { is_owner } = useOwner();
  return (
    <VStack>
      <Heading size="md">
        {is_owner ? "Мои площадки" : "Площадки"}{" "}
        {halls.length !== 0 && `(${halls.length})`}
      </Heading>
      <Grid gridTemplateColumns={"repeat(3, 1fr)"}>
        {is_owner && (
          <Box as={Link} to={"/hall/create"}>
            <AddIcon />
          </Box>
        )}
        {halls.map((hall) => (
          <SmallCard key={hall.id} {...hall} unit={priceById(hall.unit)} />
        ))}
      </Grid>
    </VStack>
  );
});

interface IMyRentedHalls {
  halls: IHall[];
}

const MyRentedHalls = observer(({ halls }: IMyRentedHalls) => {
  const priceById = useStore((state) =>
    state.priceStore.priceById.bind(state.profileStore)
  );
  return (
    <VStack>
      <Heading size="md">
        Мои боронирования {halls.length !== 0 && `(${halls.length})`}
      </Heading>
      <Grid gridTemplateColumns={"repeat(3, 1fr)"}>
        {halls.map((hall) => (
          <SmallCard key={hall.id} {...hall} unit={priceById(hall.unit)} />
        ))}
      </Grid>
    </VStack>
  );
});

interface IMainPage {
  forRent: IHall[];
  rented: IHall[];
}

const MainPage = ({ forRent, rented }: IMainPage) => {
  const { is_owner } = useOwner();
  return (
    <Fragment>
      <MyHalls halls={forRent} />
      {is_owner && <MyRentedHalls halls={rented} />}
    </Fragment>
  );
};

interface IProfileHeader {
  first_name: string;
  last_name: string;
}

const ProfileHeader = ({ first_name, last_name }: IProfileHeader) => {
  const { is_owner } = useOwner();
  return (
    <VStack>
      <Heading size="md">
        {first_name} {last_name}
      </Heading>
      <VStack>
        <Link to={"/profile/:id/info"}>Профиль</Link>
        {is_owner && (
          <Fragment>
            <Link to={"/profile/:id/favorite"}>Избранные</Link>
            <Link to={"/profile/:id/conversations"}>Сообщения</Link>
            <Link to={"/profile/:id/rent-history"}>История бронирования</Link>
          </Fragment>
        )}
      </VStack>
    </VStack>
  );
};

interface IProfileInfo {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  company?: string;
  site?: string;
  industries?: string[];
}

interface IProfileElement {
  title: string;
  value: ReactNode;
}

const ProfileElement = ({ title, value }: IProfileElement) => {
  return (
    <HStack>
      <Text sx={{ flex: "0 0 180px" }}>{title}</Text>
      <Text>{value}</Text>
    </HStack>
  );
};

const ProfileInfo = ({
  first_name,
  last_name,
  email,
  phone_number,
  company,
  site,
  industries,
}: IProfileInfo) => {
  return (
    <HStack>
      <Heading size="md">Профиль</Heading>
      <ProfileElement title="имя" value={first_name} />
      <ProfileElement title="фамилиия" value={last_name} />
      {email && (
        <ProfileElement title="e-mail" value={<a href={email}>{email}</a>} />
      )}
      <ProfileElement title="телефон" value={phone_number} />
      {company && <ProfileElement title="компания" value={company} />}
      {site && <ProfileElement title="сайт" value={site} />}
      {industries?.length !== 0 && (
        <ProfileElement title="индустрия" value={industries?.join(",")} />
      )}
    </HStack>
  );
};

export const Profile = () => {
  const { id } = useParams();
  const navigator = useNavigate();
  const user = useStore((state) => state.userStore);
  const profile = useStore((state) => state.profileStore);
  const { loading, start, end } = useLoading();
  const [loadingStatuses, setLoadingStatuses] = useState({
    successInfo: false,
    successForRend: false,
    successRented: false,
  });

  const is_owner = user.user?.id === profile.info?.id;

  useEffect(() => {
    const fetchProfile = async () => {
      start();
      if (id && +id) {
        const fetchStatuses = await profile.initialProfile(+id).finally(end);
        const failedFetch = !Object.values(fetchStatuses).every(Boolean);
        if (failedFetch) {
          navigator("/not-found");
        }
        setLoadingStatuses(fetchStatuses);
      } else {
        navigator("/not-found");
      }
    };
    fetchProfile();
  }, [end, id, navigator, profile, start]);

  const isProfileLoaded = !loading && loadingStatuses.successInfo;

  const ownerContextValue = useMemo(() => ({ is_owner }), [is_owner]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <OwnerContext.Provider value={ownerContextValue}>
      <VStack>
        <Heading>Личный кабинет</Heading>
        <Box>
          {isProfileLoaded && (
            <ProfileHeader
              first_name={profile.info?.first_name || ""}
              last_name={profile.info?.last_name || ""}
            />
          )}
        </Box>
        <Routes>
          <Route
            path="/"
            element={
              <Fragment>
                {profile.info?.is_staff && is_owner ? (
                  <Moderator />
                ) : (
                  <MainPage forRent={profile.forRent} rented={profile.rented} />
                )}
              </Fragment>
            }
          />
          <Route
            path="/info"
            element={
              <ProfileInfo
                first_name={profile.info?.first_name || ""}
                last_name={profile.info?.last_name || ""}
                email={profile.info?.email || ""}
                phone_number={profile.info?.phone_number || ""}
                company={profile.info?.organization || ""}
              />
            }
          />
        </Routes>
      </VStack>
    </OwnerContext.Provider>
  );
};
