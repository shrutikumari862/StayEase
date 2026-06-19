import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { Property } from "../../../../types";
import { supabase } from "../../../../lib/supabase";
import { useFocusEffect } from "expo-router";
import FeaturedCard from "../../../../components/FeaturedCard";
import PropertyCard from "../../../../components/PropertyCard";


import tw from "twrnc";

import { convertStackToolbarViewPropsToRNHeaderItem } from "expo-router/build/layouts/stack-utils/toolbar/StackToolbarView";
import { Ionicons } from "@expo/vector-icons";

const HomeScreen = () => {
  const { user } = useUser();
  const router = useRouter();

  const [featured, setFeatured] = useState<Property[]>([]);
  const [recommended, setRecommended] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // console.log(featured,recommended)

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: featuredData, error: featuredError } = await supabase
        .from("properties")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false });

      if (featuredError) {
        console.error("Error fetching featured properties:", featuredError);
        setError("Failed to load featured properties.");
      }

      const { data: recommendedData, error: recommendedError } = await supabase
        .from("properties")
        .select("*")
        .eq("is_featured", false)
        .order("created_at", { ascending: false });

      if (recommendedError) {
        console.error("Error fetching recommended properties:", recommendedError);
        setError((prev) => prev ? prev + " " + "Failed to load recommended properties." : "Failed to load recommended properties.");
      }

      setFeatured(featuredData ?? []);
      setRecommended(recommendedData ?? []);
    } catch (err) {
      console.error("Unexpected error fetching properties:", err);
      setError("An unexpected error occurred while loading properties.");
      setFeatured([]);
      setRecommended([]);
    } finally {
      setLoading(false);
    }
  };
  //   setLoading(true);
  //   const { data: featuredData } = await supabase
  //     .from("properties")
  //     .select("*")
  //     .eq("is_featured", true)
  //     .order("created_at", { ascending: false });

  //   const { data: recommendedData } = await supabase
  //     .from("properties")
  //     .select("*")
  //     .eq("is_featured", false)
  //     .order("created_at", { ascending: false });

  //   setFeatured(featuredData ?? []);
  //   setRecommended(recommendedData ?? []);
  //   setLoading(false);
  // };

  useFocusEffect(
    useCallback(() => {
      fetchProperties();
    }, []),
  );

  return (
    <SafeAreaView>
      <FlatList
        data={recommended}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View
              style={tw`flex-row items-center justify-between px-5 pt-4 pb-5`}
            >
              <Image
                source={require("../../../../assets/images/logo.png")}
                style={tw`w-40 h-28`}
              />
              <View style={tw`items-end`}>
                <Text>Good Morning 👋 </Text>
                <Text style={tw`text-gray-900 text-base font-bold`}>
                  {user?.firstName ?? "User"}
                </Text>
              </View>
            </View>

            {/* searchbar */}
            <TouchableOpacity
              style={tw`mx-5 mb-6 flex-row items-center bg-white rounded-2xl px-4 py-3 gap-3 bg-white rounded-2xl shadow-sm elevation-2`}
              onPress={() => router.push("/(root)/(tabs)/search")}
            >
              <Ionicons name="search-outline" size={18} color="#9ca3af" />
              <Text style={tw`text-gray-400 text-sm flex-1`}>
                Search properties, cities.....
              </Text>

              <TouchableOpacity
                onPress={() =>
                  router.push("/(root)/(tabs)/search?openFilters=true")
                }
                style={tw`w-8 h-8 bg-blue-600 rounded-xl items-center justify-center`}
              >
                <Ionicons name="options-outline" size={15} color="white" />
              </TouchableOpacity>
            </TouchableOpacity>
            {/* FeaturedSection */}
            <View style={tw`mb-6`}>
              <Text style={tw`text-gray-900 text-lg font-bold px-5 mb-4`}>
                Featured
              </Text>

              {error ? (
                <View style={tw`px-5 mb-2`}>
                  <Text style={tw`text-red-500`}>{error}</Text>
                </View>
              ) : null}

              {loading ? (
                <ActivityIndicator
                  size="small"
                  color="#2563eb"
                  className="py-10"
                />
              ) : (
                <FlatList
                  data={featured}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => <FeaturedCard property={item}/>}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                 contentContainerStyle={{paddingHorizontal:20}}
                />
              )}
            </View>

            {/* recommendedHeader */}
            <Text style={tw`text-gray-900 text-lg font-bold px-5 mb-4`}>
              Recommended
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={tw`px-5`}>
           <PropertyCard property={item}/>
          </View>
        )}
        ListEmptyComponent={
          !loading ? (
            <View style={tw`items-center py-10`}>
              <Text style={tw`text-gray-400`}>No properties found</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
