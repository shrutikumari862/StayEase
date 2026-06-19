import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import PropertyCard from "../../../../components/PropertyCard";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { useFilterStore } from "../../../../store/filterStore";
import { Property } from "../../../../types";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import FilterModal from "../../../../components/FilterModal";
import { formatPrice } from "../../../../lib/utils";
import { supabase } from "../../../../lib/supabase";

const Search = () => {
  const [results, setResuts] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { openFilters } = useLocalSearchParams<{
    openFilters?: string;
  }>();
  useEffect(() => {
    if (openFilters === "true") {
      setShowFilters(true);
    }
  }, [openFilters]);
  const {
    search,
    type,
    bedrooms,
    minPrice,
    maxPrice,
    setSearch,
    setType,
    setBedrooms,
    setMaxPrice,
    setMinPrice,
  } = useFilterStore();

  const activeFilterCount = [
    type !== null,
    bedrooms !== null,
    minPrice !== null,
    maxPrice !== null,
  ].filter(Boolean).length;

  useEffect(() => {
    fetchResults();
  }, [search, type, bedrooms, minPrice, maxPrice]);

  const fetchResults = async () => {
    setLoading(true);
    let query = supabase.from("properties").select("*");

    if (search) {
      query = query.or(`title.ilike.%${search}%,city.ilike.%${search}%`);
    }
    if (type) {
      query = query.eq("type", type);
    }
    if (bedrooms) {
      query = query.eq("bedrooms", bedrooms);
    }
    if (minPrice) {
      query = query.gte("price", minPrice);
    }
    if (maxPrice) {
      query = query.lte("price", maxPrice);
    }

    const { data } = await query.order("created_at", {
      ascending: false,
    });

    setResuts(data ?? []);
    setLoading(false);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <View style={tw`px-5 pt-4 pb-3`}>
        <Text style={tw`text-2xl font-bold text-gray-900 mb-4 `}>
          Find Property
        </Text>

        <View style={tw`flex-row items-center gap-3`}>
          <View
            style={tw`flex-1 flex-row items-center bg-white rounded-2xl px-4 gap-3 shadow-sm elevation-2`}
          >
            <Ionicons name="search-outline" size={18} color="#9ca3af" />
            <TextInput
              style={tw`flex-1 py-3 text-gray-800`}
              placeholder="Searech by Title or City..."
              placeholderTextColor="#9ca3af"
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={18} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            onPress={() => setShowFilters(true)}
            style={tw`w-12 h-12 rounded-2xl items-center justify-center ${
              activeFilterCount > 0 ? "bg-blue-600" : "bg-white"
            } shadow-sm elevation-2`}
          >
            <Ionicons
              name="options-outline"
              size={20}
              color={activeFilterCount > 0 ? "#fff " : "#374151"}
            />
            {activeFilterCount > 0 && (
              <View
                style={tw`absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full items-center justify-center`}
              >
                <Text style={tw`text-white text-[9px] font-bold`}>
                  {activeFilterCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        {/* {FilterChips} */}
        {activeFilterCount > 0 && (
          <View style={tw`flex-row flex-wrap gap-2 mt-3`}>
            {type && (
              <View
                style={tw`flex-row items-center bg-blue-50 border border-blue-200 rounded-full px-3 py-1 gap-1`}
              >
                <Text
                  style={tw`text-blue-700 text-xs font-seminbold capitalize`}
                >
                  {type}
                </Text>
                <TouchableOpacity onPress={() => setType(null)}>
                  <Ionicons name="close" size={12} color="#1d4ed8" />
                </TouchableOpacity>
              </View>
            )}

            {bedrooms !== null && (
              <View
                style={tw`flex-row items-center bg-blue-50 border border-blue-200 rounded-full px-3 py-1 gap-1`}
              >
                <Ionicons name="bed-outline" size={11} color="#1d4ed8" />
                <Text
                  style={tw`text-blue-700 text-xs font-seminbold capitalize`}
                >
                  {bedrooms === 4
                    ? "4+ beds"
                    : `${bedrooms} bed${bedrooms > 1 ? "s" : ""}`}
                </Text>
                <TouchableOpacity onPress={() => setBedrooms(null)}>
                  <Ionicons name="close" size={12} color="#1d4ed8" />
                </TouchableOpacity>
              </View>
            )}

            {(minPrice !== null || maxPrice !== null) && (
              <View
                style={tw`flex-row items-center bg-blue-50 border border-blue-200 rounded-full px-3 py-1 gap-1`}
              >
                <Text
                  style={tw`text-blue-700 text-xs font-seminbold capitalize`}
                >
                  {minPrice && maxPrice
                    ? `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
                    : minPrice
                      ? `From ${formatPrice(minPrice)}`
                      : `Up to ${formatPrice(maxPrice!)}`}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setMaxPrice(null);
                    setMinPrice(null);
                  }}
                >
                  <Ionicons name="close" size={12} color="#1d4ed8" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Results */}
       <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding:20,paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={tw`text-sm text-gray-400 mb-4`}>
            {loading ? "Searching....":`${results.length} properties found`}
          </Text>
        }
        renderItem={({ item }) => (
         
           <PropertyCard property={item}/>
          
        )}
        ListEmptyComponent={
          !loading ? (
            <View style={tw`items-center py-10`}>
              <Text style={tw`text-gray-400`}>No properties found</Text>
              <Text style={tw`text-gray-300 text-sm mt-1`}>Try a different search or adjust filters</Text>
            </View>
          ) : (
            <ActivityIndicator style={tw`py-20`} size="large" color="#2563EB"></ActivityIndicator>
          )
        }
      />

      {/* FilterModel */}
      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
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

export default Search;
