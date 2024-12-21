import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import api from "../api";

const StatusBadge = ({ status }) => {
  const statusColors = {
    "not started": "#f44336",
    "in progress": "#ff9800",
    completed: "#4caf50",
  };

  const backgroundColor = statusColors[status] || "#9e9e9e";

  return (
    <View style={[styles.statusBadge, { backgroundColor }]}>
      <Text style={styles.statusBadgeText}>{status}</Text>
    </View>
  );
};

export default function TodoList({ navigation }) {
  const [todos, setTodos] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [modalOptions, setModalOptions] = useState([]);
  const [modalType, setModalType] = useState("");
  const [selectedValue, setSelectedValue] = useState("");

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await api.get("/todos", {
        params: {
          status: statusFilter,
          search: searchQuery,
          sort: sortBy,
          order: sortOrder,
        },
      });
      setTodos(response.data.data);
    } catch (error) {
      console.error("Error fetching todos:", error.message);
      Alert.alert("Error", "Failed to load todos. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchTodos();
  };

  const handleSelection = (value) => {
    if (modalType === "status") setStatusFilter(value);
    else if (modalType === "sortBy") setSortBy(value);
    else if (modalType === "sortOrder") setSortOrder(value);
    setShowModal(false);
  };

  const openModal = (type, options) => {
    setModalType(type);
    setModalOptions(options);
    setShowModal(true);
  };

  const renderDropdown = (type, value, options) => (
    <TouchableOpacity
      style={styles.modalTrigger}
      onPress={() => openModal(type, options)}
    >
      <Text>{value || (type === "status" ? "All Todos" : "Default")}</Text>
    </TouchableOpacity>
  );

  useFocusEffect(
    React.useCallback(() => {
      fetchTodos();
    }, [statusFilter, searchQuery, sortBy, sortOrder])
  );

  const ListHeader = useMemo(
    () => (
      <View style={styles.listHeader}>
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Filter By Status:</Text>
          <View style={styles.pickerContainer}>
            {Platform.OS === "ios" ? (
              renderDropdown("status", statusFilter, [
                { label: "All Todos", value: "" },
                { label: "Not Started", value: "not started" },
                { label: "In Progress", value: "in progress" },
                { label: "Completed", value: "completed" },
              ])
            ) : (
              <Picker
                selectedValue={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
                style={styles.picker}
              >
                <Picker.Item label="All Todos" value=" " />
                <Picker.Item label="Not Started" value="not started" />
                <Picker.Item label="In Progress" value="in progress" />
                <Picker.Item label="Completed" value="completed" />
              </Picker>
            )}
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Text style={styles.searchLabel}>Search Keyword</Text>
          <View style={styles.searchInputWrapper}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by title or details..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setSearchQuery("")}
              >
                <MaterialIcons name="clear" size={24} color="#000" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={[styles.sortContainer, { gap: 8 }]}>
          <View style={styles.sortItem}>
            <Text style={styles.sortLabel}>Sort By:</Text>
            <View style={styles.pickerContainer}>
              {Platform.OS === "ios" ? (
                renderDropdown("sortBy", sortBy, [
                  { label: "Default", value: "" },
                  { label: "Title", value: "title" },
                  { label: "Status", value: "status" },
                ])
              ) : (
                <Picker
                  selectedValue={sortBy}
                  onValueChange={(value) => setSortBy(value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Default" value=" " />
                  <Picker.Item label="Title" value="title" />
                  <Picker.Item label="Status" value="status" />
                </Picker>
              )}
            </View>
          </View>

          <View style={styles.sortItem}>
            <Text style={styles.sortLabel}>Order:</Text>
            <View style={styles.pickerContainer}>
              {Platform.OS === "ios" ? (
                renderDropdown("sortOrder", sortOrder, [
                  { label: "Ascending", value: "asc" },
                  { label: "Descending", value: "desc" },
                ])
              ) : (
                <Picker
                  selectedValue={sortOrder}
                  onValueChange={(value) => setSortOrder(value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Ascending" value="asc" />
                  <Picker.Item label="Descending" value="desc" />
                </Picker>
              )}
            </View>
          </View>
        </View>
      </View>
    ),
    [searchQuery, statusFilter, sortBy, sortOrder]
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.todoCard}>
            <View style={styles.todoContent}>
              <Text style={styles.todoTitle}>{item.title}</Text>
              <StatusBadge status={item.status} />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() =>
                    navigation.navigate("TodoDetails", { todo: item })
                  }
                >
                  <MaterialIcons name="visibility" size={24} color="#2196F3" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() =>
                    navigation.navigate("TodoForm", { todo: item })
                  }
                >
                  <MaterialIcons name="edit" size={24} color="#4CAF50" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>No todos available.</Text>
        }
        ListHeaderComponent={ListHeader}
        ListFooterComponent={
          loading && (
            <ActivityIndicator
              size="large"
              color="#4CAF50"
              style={styles.loader}
            />
          )
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("TodoForm")}
      >
        <MaterialIcons name="add" size={32} color="#fff" />
      </TouchableOpacity>
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {modalOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.modalOption}
                onPress={() => handleSelection(option.value)}
              >
                <Text>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    height: 40,
  },
  modalTrigger: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "100%",
    alignItems: "center",
  },
  listHeader: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  searchLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  picker: {
    color: "#000",
  },
  searchContainer: {
    alignItems: "left",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: "100%",
  },
  clearButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  sortContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 20,
    gap: 8,
  },
  sortItem: {
    flex: 1,
    marginBottom: 8,
  },
  sortLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  loader: {
    marginTop: 20,
  },
  todoCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  todoContent: {
    padding: 16,
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  todoStatus: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
    fontStyle: "italic",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  iconButton: {
    marginLeft: 12,
  },
  emptyMessage: {
    textAlign: "center",
    marginTop: 50,
    color: "#999",
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#4CAF50",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  listHeader: { paddingHorizontal: 16, marginTop: 10, marginBottom: 20 },
  statusBadge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginTop: 8,
  },
  statusBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  todoCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  todoContent: { padding: 16 },
  todoTitle: { fontSize: 16, fontWeight: "600", color: "#333" },
});
