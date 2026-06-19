import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Property } from "../types";
import { useRouter } from "expo-router";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { formatPrice } from "../lib/utils";

const FeaturedCard = ({ property }: { property: Property }) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={tw`w-72 mr-2 rounded-3xl overflow-hidden bg-white rounded-2xl shadow-sm elevation-2 ${property.is_sold ? "opacity-50" : "opacity-100"}`}
     onPress={() => router.push(`/(root)/property/${property.id}`)}
    >
      <Image
        source={ property.images.length >0 ? {uri:property.images[0]}: require("../assets/images/logo.png") }
        style={tw`w-full h-44 resizeMode="cover"`}
      />
      <View
        style={tw` absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full`}
      >
        <Text style={tw`text-xs font-semibold text-blue-600 capitalize`}>
          {property.type}
        </Text>
      </View>

      {property.is_sold && (
        <View
          style={tw`absolute top-3 right-3 bg-red-500 px-3 py-1 rounded-full`}
        >
          <Text style={tw`text-xs font-semibold text-white `}>Sold</Text>
        </View>
      )}

      <View style={tw`p-4`}>
        <Text
          style={tw`text-base font-bold text-gray-800 mb-1`}
          numberOfLines={1}
        >
          {property.title}
        </Text>
        <View style={tw`flex-row items-center gap-1 mb-3`}>
          <Ionicons name="location-outline" size={13} color={"#6b7280"} />
          <Text style={tw`text-xs text-gray-500 `} numberOfLines={1}>
            {property.address},{property.city}
          </Text>
        </View>

        <View style={tw`flex-row items-center justify-between`}>
          <Text style={tw`text-blue-600 font-bold text-base`}>
            {formatPrice(property.price)}
          </Text>
          <View style={tw`flex-row items-center gap-3`}>
            <View style={tw`flex-row items-center gap-1`}>
              <Ionicons name="bed-outline" size={13} color="#6b7280" />
              <Text style={tw`text-xs text-gray-500 `}>
                {property.bedrooms}
              </Text>
            </View>

            <View style={tw`flex-row items-center gap-1`}>
              <Ionicons name="water-outline" size={13} color="#6b7280" />
              <Text style={tw`text-xs text-gray-500 `}>
                {property.bathrooms}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FeaturedCard;
