import React, { useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { api } from "../../services/api";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useChecklistForm } from "../../contexts/checklistContext";
import { Input } from "../../components/form/input";
import Materialnicons from "@expo/vector-icons/MaterialIcons";

interface ChecklistForm {
  model_id: string;
  organization_id: string;
  property_id: string;
  user_id: string;
}

export function SelectProperty() {
  const { form, setChecklist, checklist } = useChecklistForm();
  const focus = useIsFocused();

  const [properties, setProperties] = useState<Property[]>([]);

  const screen = useNavigation<NativeStackNavigationProp<any>>();

  const {
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  useEffect(() => {
    form.clearErrors("property_id");

    const organization_id = form.getValues("organization_id");

    // api
    //   .get(
    //     `/api/properties?page=1&per_page=50&organization_id=${organization_id}`
    //   )
    //   .then(({ data }) => console.log(data));

    api
      .get("/api/organizations/" + organization_id + "/properties")
      .then(({ data }) => setProperties(data));
  }, []);

  const submit = async (values: ChecklistForm) => {
    if (!checklist?.property?.id) {
      form.setError("property_id", {
        type: "required",
      });
      return;
    }

    console.log(values);

    screen.push("ChecklistsScreen");
  };

  const onSelectProperty = (property: any) => {
    form.clearErrors("property_id");

    if (property.id === checklist?.property?.id) {
      setChecklist((prev: any) => ({ ...prev, property: undefined }));
      return;
    }

    setChecklist((prev: any) => ({ ...prev, property }));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.title} numberOfLines={1}>
          Selecione o Imóveis
        </Text>
      </View>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.form}>
            {/* <Input
              control={control}
              errors={errors}
              label="Nome"
              name="name"
              placeholder="Procure pelo nome do local"
              errorMessage="Insira o nome do imóvel"
            /> */}
            <FlatList
              data={properties}
              ListFooterComponent={
                <TouchableOpacity
                  style={[
                    styles.card,
                    {
                      backgroundColor: "#1a318020",
                      borderStyle: "dashed",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.cardTitle,
                      {
                        color: "#1A1A1A90",
                      },
                    ]}
                    numberOfLines={1}
                  >
                    CRIAR IMÓVEL
                  </Text>
                  <Materialnicons
                    name="add-circle-outline"
                    size={32}
                    color={"#1A1A1A90"}
                  />
                </TouchableOpacity>
              }
              style={{
                flex: 1,
                shadowColor: "black",
                shadowOffset: {
                  height: 2,
                  width: 4,
                },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                borderRadius: 16,
              }}
              renderItem={(item) => (
                <TouchableOpacity
                  key={item.item.id}
                  style={[
                    styles.card,
                    {
                      backgroundColor:
                        checklist?.property?.id === item.item.id
                          ? "#1a318050"
                          : undefined,
                    },
                  ]}
                  onPress={() => onSelectProperty(item.item)}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {item.item.name}
                    </Text>
                    <Badge type={item.item.type} />
                  </View>
                  <Text style={styles.cardText} numberOfLines={1}>
                    {item.item.address}
                  </Text>
                </TouchableOpacity>
              )}
            />
            {errors["property_id"] ? (
              <Text style={styles.errorText}>* Selecione um imóvel</Text>
            ) : null}
            <TouchableOpacity
              onPress={handleSubmit(submit)}
              style={styles.saveButton}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                PROXIMO
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const Badge = ({ type }: { type: string }) => {
  return (
    <View
      style={{
        padding: 4,
        backgroundColor:
          type === "RENTED"
            ? "#ca8a04"
            : type === "GRANT"
            ? "#dc2626"
            : "#1a3280",
        borderRadius: 4,
      }}
    >
      <Text style={{ color: "white" }}>
        {type === "RENTED"
          ? "ALUGADO"
          : type === "GRANT"
          ? "CONCESSÃO"
          : "PRÓPRIO"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#e8e8e8",
    shadowColor: "black",
    justifyContent: "flex-start",
  },
  form: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 16,
    gap: 8,
    flex: 1,
  },
  saveButton: {
    backgroundColor: "#58e68e",
    borderColor: "#1c492e",
    padding: 4,
    borderWidth: 1,
    borderRadius: 8,
    height: 40,
    paddingVertical: 10,
    alignSelf: "flex-end",
    width: "30%",
    display: "flex",
    alignItems: "center",
  },
  button: {
    borderColor: "#1a3180",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 8,
    height: 40,
    width: 40,
    display: "flex",
    alignItems: "center",
  },
  card: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#c8ccda",
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 8,
    gap: 4,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    maxWidth: "70%",
  },
  cardText: {
    color: "#1A1A1A",
  },
  cardSid: {
    color: "#3b3b3b",
    fontSize: 16,
  },
  cardImage: {
    height: 128,
    marginVertical: 8,
    borderRadius: 4,
  },
  observation: {
    fontSize: 16,
  },
  iconButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
    borderWidth: 1,
    borderColor: "#1A1A1A",
    borderRadius: 3,
    flex: 1,
  },
  errorText: {
    color: "#f75656",
    marginLeft: 8,
    fontWeight: 600,
    marginBottom: 10,
  },
});
