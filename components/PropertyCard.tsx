import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Property } from "../types";
import { useRouter } from "expo-router";
import tw from "twrnc";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatPrice } from "../lib/utils";

const PropertyCard = ({
  property,
  onUnsave,
  showSave = false,
}: {
  property: Property;
  onUnsave?: () => void;
  showSave?: boolean;
}) => {

 const router = useRouter();

 const isSaved=true;

  return (
    <TouchableOpacity  style={tw`bg-white flex-row rounded-2xl overflow-hidden  shadow-sm elevation-2 ${property.is_sold ? "opacity-50" : "opacity-100"} mb-4`}
      onPress={() => router.push(`/(root)/property/${property.id}`)}>
       <Image
        source={ property.images.length >0 ? {uri:property.images[0]}: require("../assets/images/logo.png") }
        style={tw`w-28 h-28 resizeMode="cover"`}
      />
      <View style={tw`flex-1 p-3 justify-between`}>
        <View>
          <Text style={tw`text-sm font-bold text-gray-800 mb-1 `} numberOfLines={1}>
            {property.title}
          </Text>

          <View style={tw`flex-row items-center gap-1 mb-3`}>
          <Ionicons name="location-outline" size={13} color={"#6b7280"} />
          <Text style={tw`text-xs text-gray-500 `} numberOfLines={1}>
           {property.city}
          </Text>
        </View>


        </View>

        <View style={tw`flex-row items-center justify-between`}
        >
         <Text style={tw`text-blue-600 font-bold text-sm`}>
            {formatPrice(property.price)}
          </Text>
           {property.is_sold && (
        <View
          style={tw`absolute top-3 right-3 bg-red-50 px-3 py-1 rounded-full `}
        >
          <Text style={tw`text-xs font-semibold text-red-500 `}>Sold</Text>
        </View>
      )}

      <View style={tw`flex-row gap-3`}>
         <View style={tw`flex-row items-center gap-1`}>
              <Ionicons name="bed-outline" size={11} color="#6b7280" />
              <Text style={tw`text-xs text-gray-500 `}>
                {property.bedrooms} bd
              </Text>
            </View>

             <View style={tw`flex-row items-center gap-1`}>
              <Ionicons name="expand-outline" size={11} color="#6b7280" />
              <Text style={tw`text-xs text-gray-500 `}>
                {property.area_sqft} ft²
              </Text>
            </View>

      </View>



        </View>
      </View>

     <TouchableOpacity style={tw`w-10 items-center pt-3`}>
      <Ionicons name={isSaved?"heart": "heart-outline"}
      size={18}
      color={isSaved?"#EF4444":"#9CA3AF"}
      />
     </TouchableOpacity>





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

export default PropertyCard;
