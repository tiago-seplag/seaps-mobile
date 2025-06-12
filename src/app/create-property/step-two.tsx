import { useCallback, useEffect, useState } from "react";
import {
  StaticScreenProps,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { useForm } from "react-hook-form";

import { BaseSafeAreaView, BaseView } from "../../components/skeleton";
import { Card, CardText, CardTitle } from "../../components/ui/card";
import { Select } from "../../components/form/select";
import { api } from "../../services/api";
import { CreatePropertyRoutesProps } from "./route";
import {
  FlatList,
  Keyboard,
  RefreshControl,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Header } from "../../components/ui/header";
import { Row } from "../../components/row";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Icon } from "../../components/icon";
import { Input } from "../../components/form/input";
import { StepsCount } from "../../components/steps-count";

type Props = StaticScreenProps<{
  organization_id: string;
}>;

export const StepTwoScreen = ({ route }: Props) => {
  const organization_id = route.params.organization_id;
  const isFocused = useIsFocused();
  const navigation = useNavigation<CreatePropertyRoutesProps>();

  const [responsible, setResponsible] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<{ person_id: string }>({
    defaultValues: {
      person_id: undefined,
    },
  });

  const fetchData = useCallback(() => {
    setLoading(true);
    api
      .get("/api/organizations/" + organization_id + "/responsible")
      .then(({ data }) => setResponsible(data))
      .finally(() => setLoading(false));
  }, [organization_id]);

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  const submit = (values: any) => {
    navigation.push("StepThree");
  };

  const person_id = watch("person_id");

  return (
    <BaseSafeAreaView>
      <Header backButton title={"CRIAR IMÓVEL"} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BaseView style={{ gap: 16 }}>
          <StepsCount step={2} length={3} />
          <Row />
          <Card style={{ gap: 16, flex: 1 }}>
            <View style={{ display: "none" }}>
              <Select
                label="Responsável"
                placeholder="Selecione o Responsável do imóvel"
                control={control}
                errors={errors}
                name="person_id"
                errorMessage="Selecione o Responsável do imóvel"
                options={responsible}
              />
            </View>
            <Input
              control={control}
              errors={errors}
              label="RESPONSÁVEL:"
              name="name"
              placeholder="Procurar responsável"
              required={false}
              onChangeText={(e) => setFilter(e)}
            />
            <FlatList
              data={
                filter
                  ? responsible.filter((res) => res.name.startsWith(filter))
                  : responsible
              }
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={loading} onRefresh={fetchData} />
              }
              renderItem={(item) => (
                <TouchableOpacity
                  key={item.item.id}
                  onPress={() =>
                    person_id === item.item.id
                      ? reset()
                      : setValue("person_id", item.item.id)
                  }
                >
                  <Card
                    style={[
                      {
                        backgroundColor:
                          person_id === item.item.id ? "#E8EAF2" : "#FFFFFF",
                      },
                      { flexDirection: "row", justifyContent: "space-between" },
                    ]}
                  >
                    <View>
                      <CardTitle numberOfLines={1} style={{ fontSize: 16 }}>
                        {item.item.name}
                      </CardTitle>
                      <CardText numberOfLines={1} style={{ fontSize: 14 }}>
                        {item.item.role}
                      </CardText>
                      <CardText numberOfLines={1} style={{ fontWeight: 300 }}>
                        {item.item.email}
                      </CardText>
                    </View>
                    <Icon
                      icon={
                        person_id === item.item.id
                          ? "radio-button-checked"
                          : "radio-button-unchecked"
                      }
                      style={{ backgroundColor: "#E8EAF2" }}
                    />
                  </Card>
                </TouchableOpacity>
              )}
              ListFooterComponent={() => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.push("CreateResponsible", {
                      organization_id: organization_id,
                    })
                  }
                >
                  <Card
                    style={{
                      alignItems: "center",
                      backgroundColor: "#E8EAF2",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <Icon
                      style={{
                        backgroundColor: "#E8EAF2",
                        paddingHorizontal: 4,
                      }}
                      icon="add"
                    />
                    <CardTitle style={{ fontSize: 16 }}>
                      CRIAR RESPONSÁVEL
                    </CardTitle>
                  </Card>
                </TouchableOpacity>
              )}
              style={{ flex: 1 }}
            />
            {errors["person_id"] ? (
              <Text
                style={{
                  color: "#f75656",
                  marginLeft: 8,
                  fontWeight: 600,
                  marginBottom: 10,
                }}
              >
                *Selecione o Responsável do imóvel
              </Text>
            ) : null}
          </Card>
          <TouchableOpacity
            onPress={handleSubmit(submit)}
            style={{
              flexDirection: "row",
              marginTop: "auto",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#067C03",
              padding: 12,
              borderRadius: 12,
              gap: 4,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#FEFEFE",
              }}
            >
              PROXIMO
            </Text>
            <MaterialIcons name={"chevron-right"} size={32} color={"#FEFEFE"} />
          </TouchableOpacity>
        </BaseView>
      </TouchableWithoutFeedback>
    </BaseSafeAreaView>
  );
};
