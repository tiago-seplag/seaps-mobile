import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Animated,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  StaticScreenProps,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";

import { useCreateChecklist } from "../../contexts/checklistContext";
import { Input } from "../../components/form/input";
import { Header } from "../../components/ui/header";
import { Card } from "../../components/ui/card";
import { FormButton } from "../../components/form/form-button";
import { BaseSafeAreaView, BaseView } from "../../components/skeleton";

import { api, getProperties } from "../../services";

import { PropertyItem } from "./components/property-item";
import { CreateChecklistRoutesProps } from "./routes";
import { Select } from "../../components/form/select";
import { CreateButton } from "../../components/create-button";
import { useChecklistStore } from "../../stores/createChecklistStore";
import { StepsCount } from "../../components/steps-count";
import { Row } from "../../components/row";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface ChecklistForm {
  name?: string;
  property_id: string;
}

type Props = StaticScreenProps<{
  organization_id: string;
}>;

export function StepTwoScreen({ route }: Props) {
  const isFocused = useIsFocused();
  const { setChecklist } = useChecklistStore();

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChecklistForm>();
  const [properties, setProperties] = useState<Property[]>([]);
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const drawerAnim = useRef(new Animated.Value(300)).current;

  const screen = useNavigation<CreateChecklistRoutesProps>();
  const navigation = useNavigation();

  const openDrawer = () => {
    setDrawerVisible(true);
    Animated.timing(drawerAnim, {
      toValue: 0,
      duration: 280,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(drawerAnim, {
      toValue: 500,
      duration: 210,
      useNativeDriver: true,
    }).start(() => setDrawerVisible(false));
  };

  const handleSelectCity = (city: string | null) => {
    setSelectedCity(city);
    closeDrawer();
  };

  useEffect(() => {
    getProperties({
      per_page: 1000,
      organization_id: route.params.organization_id,
    })
      .then((response) => setProperties(response.data))
      .finally(() => setLoading(false));
  }, [isFocused]);

  const submit = async (values: ChecklistForm) => {
    setChecklist((prev) => ({ ...prev, property_id: values.property_id }));
    screen.push("StepThree");
  };

  const property_id = watch("property_id");
  const name = watch("name");

  const filteredProperties = properties.filter((item) => {
    const matchesName = name
      ? item.name.toUpperCase().includes(name.toUpperCase())
      : true;
    const matchesCity = selectedCity
      ? item.address?.toUpperCase().includes(selectedCity.toUpperCase())
      : true;
    return matchesName && matchesCity;
  });

  useEffect(() => {
    api
      .get(
        `https://brasilapi.com.br/api/ibge/municipios/v1/MT?providers=dados-abertos-br,gov,wikipedia`,
      )
      .then(({ data }) => {
        setCities(
          data.map((city: { nome: string; codigo_ibge: string }) => ({
            id: city.nome.replace(/\s*\(.*?\)/g, ""),
            name: city.nome.replace(/\s*\(.*?\)/g, ""),
          })),
        );
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <>
      <BaseSafeAreaView>
        <Header backButton title={"CRIAR CHECKLIST"} />
        <BaseView style={{ gap: 16, flex: 1 }}>
          <StepsCount step={2} length={3} />
          <Row />
          <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            style={{ flex: 1 }}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <Card style={{ gap: 16, flex: 1 }}>
                <View style={styles.searchRow}>
                  <View style={{ flex: 1 }}>
                    <Input
                      required={false}
                      control={control}
                      errors={errors}
                      name="name"
                      placeholder="Procure pelo nome do imóvel"
                      errorMessage="Insira o nome do imóvel"
                    />
                  </View>
                  <TouchableOpacity
                    onPress={openDrawer}
                    style={[
                      styles.cityFilterButton,
                      selectedCity ? styles.cityFilterButtonActive : null,
                    ]}
                  >
                    <MaterialIcons
                      name="location-city"
                      size={22}
                      color={selectedCity ? "#FFFFFF" : "#1A3180"}
                    />
                  </TouchableOpacity>
                </View>
                {selectedCity ? (
                  <TouchableOpacity
                    onPress={() => setSelectedCity(null)}
                    style={styles.activeCityChip}
                  >
                    <Text style={styles.activeCityChipText}>
                      {selectedCity}
                    </Text>
                    <MaterialIcons name="close" size={14} color="#1A3180" />
                  </TouchableOpacity>
                ) : null}
                {(selectedCity || name) && (
                  <Text
                    style={{
                      fontSize: 12,
                      width: "100%",
                      color: "#0E1B46",
                      textAlign: "left",
                      fontWeight: "600",
                    }}
                  >
                    Imóveis: {filteredProperties.length} de {properties.length}
                  </Text>
                )}
                <FlatList
                  refreshControl={<RefreshControl refreshing={loading} />}
                  data={filteredProperties}
                  ListFooterComponent={
                    <CreateButton
                      title="CRIAR IMÓVEL"
                      onPress={() =>
                        navigation.navigate("CreateProperty", {
                          screen: "StepOne",
                          params: {
                            organization_id: route.params.organization_id,
                            origin: "CreateChecklist",
                          },
                        })
                      }
                    />
                  }
                  renderItem={(item) => (
                    <PropertyItem
                      selected={property_id === item.item.id}
                      item={item}
                      onSelect={() =>
                        property_id === item.item.id
                          ? reset()
                          : setValue("property_id", item.item.id)
                      }
                    />
                  )}
                />
                {errors["property_id"] ? (
                  <Text
                    style={{
                      color: "#f75656",
                      marginLeft: 8,
                      fontWeight: 600,
                      marginBottom: 10,
                    }}
                  >
                    * Selecione um imóvel
                  </Text>
                ) : null}
              </Card>
            </TouchableWithoutFeedback>
            <FormButton
              onPress={handleSubmit(submit)}
              title="PRÓXIMO"
              icon="chevron-right"
            />
          </KeyboardAvoidingView>
        </BaseView>
      </BaseSafeAreaView>
      <Modal
        visible={drawerVisible}
        transparent
        animationType="none"
        onRequestClose={closeDrawer}
      >
        <Pressable style={styles.drawerOverlay} onPress={closeDrawer}>
          <Animated.View
            style={[
              styles.drawerContainer,
              { transform: [{ translateY: drawerAnim }] },
            ]}
          >
            <Pressable>
              <View style={styles.drawerHandle} />
              <Text style={styles.drawerTitle}>Filtrar por cidade</Text>
              <FlatList
                data={[{ id: null, name: "Todas as cidades" }, ...cities]}
                keyExtractor={(item) => item.id ?? "__all__"}
                style={{ maxHeight: 400 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.cityItem,
                      selectedCity === item.id ? styles.cityItemSelected : null,
                    ]}
                    onPress={() => handleSelectCity(item.id)}
                  >
                    <Text
                      style={[
                        styles.cityItemText,
                        selectedCity === item.id
                          ? styles.cityItemTextSelected
                          : null,
                      ]}
                    >
                      {item.name}
                    </Text>
                    {selectedCity === item.id ||
                    (item.id === null && !selectedCity) ? (
                      <MaterialIcons name="check" size={18} color="#1A3180" />
                    ) : null}
                  </TouchableOpacity>
                )}
              />
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  cityFilterButton: {
    height: 42,
    width: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1A3180",
    backgroundColor: "#FBFBFC",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  cityFilterButtonActive: {
    backgroundColor: "#1A3180",
  },
  activeCityChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#E8ECF8",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
    marginTop: -8,
  },
  activeCityChipText: {
    color: "#1A3180",
    fontSize: 12,
    fontWeight: "600",
  },
  drawerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  drawerContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: 32,
  },
  drawerHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#B8BFD8",
    borderRadius: 4,
    alignSelf: "center",
    marginBottom: 16,
  },
  drawerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0E1B46",
    marginBottom: 12,
    textAlign: "center",
  },
  cityItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 4,
  },
  cityItemSelected: {
    backgroundColor: "#E8ECF8",
  },
  cityItemText: {
    fontSize: 14,
    color: "#0E1B46",
  },
  cityItemTextSelected: {
    fontWeight: "700",
    color: "#1A3180",
  },
});
