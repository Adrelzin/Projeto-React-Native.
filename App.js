import React from "react";
import { View, Text, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const categories = [
  { label: "Resort", icon: "sunny-outline", lib: "ion" },
  { label: "Homestay", icon: "home-outline", lib: "ion" },
  { label: "Hotel", icon: "business-outline", lib: "ion" },
  { label: "Lodge", icon: "bonfire-outline", lib: "ion" },
  { label: "Villa", icon: "villa", lib: "mat" },
  { label: "Apartment", icon: "apartment", lib: "mat" },
  { label: "Hostel", icon: "bed-outline", lib: "ion" },
  { label: "See all", icon: "apps-outline", lib: "ion" },
];

const CategoryIcon = ({ icon, lib }) => {
  if (lib === "mat") return <MaterialIcons name={icon} size={24} color="#fff" />;
  return <Ionicons name={icon} size={24} color="#fff" />;
};

const SectionHeader = ({ title }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.title}>{title}</Text>
    <Ionicons name="menu" size={22} color="#333" />
  </View>
);

export default function Home() {
  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>

        {/* Logo + Search */}
        <View style={styles.searchRow}>
          <View style={styles.logoBox}>
            <Ionicons name="reorder-three-outline" size={30} color="#fff" />
            <Ionicons name="airplane" size={14} color="#fff" style={styles.logoPlane} />
          </View>

          <View style={styles.searchBox}>
            <TextInput placeholder="Search here ..." style={{ flex: 1 }} />
            <Ionicons name="search" size={20} color="#aaa" />
          </View>
        </View>

        {/* User row */}
        <View style={styles.userRow}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/women/65.jpg" }}
            style={styles.avatar}
          />

          <View>
            <Text style={styles.welcome}>Welcome!</Text>
            <Text style={styles.name}>Donna Stroupe</Text>
          </View>

          <View style={styles.bellWrapper}>
            <Ionicons name="notifications-outline" size={22} color="#5B57A6" />
          </View>
        </View>

      </View>

      <ScrollView>

        {/* CATEGORY */}
        <View style={styles.section}>
          <SectionHeader title="Category" />

          <View style={styles.categoryGrid}>
            {categories.map((item, index) => (
              <TouchableOpacity key={index} style={styles.categoryItem}>
                <View style={styles.circle}>
                  <CategoryIcon icon={item.icon} lib={item.lib} />
                </View>
                <Text style={styles.categoryLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* POPULAR DESTINATION */}
        <View style={styles.section}>
          <SectionHeader title="Popular Destination" />

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Image source={{ uri: "https://picsum.photos/id/280/400/400" }} style={styles.destination} />
            <Image source={{ uri: "https://picsum.photos/id/167/400/400" }} style={styles.destination} />
            <Image source={{ uri: "https://picsum.photos/id/Nature/400/400" }} style={styles.destination} />
          </ScrollView>
        </View>

        {/* RECOMMENDED */}
        <View style={styles.section}>
          <SectionHeader title="Recommended" />

          <View style={styles.recommendedRow}>
            <Image source={{ uri: "https://picsum.photos/id/15/800/400" }} style={styles.recommended} />
            <Image source={{ uri: "https://picsum.photos/id/50/800/400" }} style={styles.recommended} />
          </View>
        </View>

      </ScrollView>

      {/* BOTTOM MENU */}
      <View style={styles.bottomMenu}>
        <View style={styles.bottomItem}>
          <Ionicons name="home" size={24} color="white" />
          <Text style={styles.bottomLabel}>Home</Text>
        </View>
        <View style={styles.bottomItem}>
          <Ionicons name="compass-outline" size={24} color="white" />
          <Text style={styles.bottomLabel}>Explore</Text>
        </View>
        <View style={styles.bottomItem}>
          <Ionicons name="search-outline" size={24} color="white" />
          <Text style={styles.bottomLabel}>Search</Text>
        </View>
        <View style={styles.bottomItem}>
          <Ionicons name="person-outline" size={24} color="white" />
          <Text style={styles.bottomLabel}>Profile</Text>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    backgroundColor: "#5B57A6",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
  },

  logoBox: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  logoPlane: {
    position: "absolute",
    top: 2,
    right: 2,
    transform: [{ rotate: "45deg" }],
  },

  searchBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#fff",
  },

  welcome: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  name: {
    color: "#ddd",
    fontSize: 13,
  },

  bellWrapper: {
    marginLeft: "auto",
    backgroundColor: "#fff",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  section: {
    padding: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
  },

  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  categoryItem: {
    alignItems: "center",
    width: "22%",
    marginBottom: 15,
  },

  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#5B57A6",
    marginBottom: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  categoryLabel: {
    fontSize: 11,
    textAlign: "center",
    color: "#333",
  },

  destination: {
    width: 130,
    height: 130,
    borderRadius: 15,
    marginRight: 10,
  },

  recommendedRow: {
    flexDirection: "row",
    gap: 10,
  },

  recommended: {
    flex: 1,
    height: 150,
    borderRadius: 15,
  },

  bottomMenu: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#5B57A6",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },

  bottomItem: {
    alignItems: "center",
    gap: 4,
  },

  bottomLabel: {
    color: "#fff",
    fontSize: 11,
  },
});
