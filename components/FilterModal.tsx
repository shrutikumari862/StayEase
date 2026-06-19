import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { useFilterStore } from "../store/filterStore";
import tw from "twrnc";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { PropertyType } from "../store/filterStore";

const TYPES: { label: string; value: PropertyType }[] = [
  { label: "All", value: null },
  { label: "Apartment", value: "apartment" },
  { label: "House", value: "house" },
  { label: "Villa", value: "villa" },
  { label: "Studio", value: "studio" },
];
const BEDS = [
  { label: "Any", value: null },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4+", value: 4 },
];

const PRICE_PRESETS = [
  { label: "Under ₹50L", min: null, max: 5000000 },
  { label: "₹50L – ₹1Cr", min: 5000000, max: 10000000 },
  { label: "₹1Cr – ₹2Cr", min: 10000000, max: 20000000 },
  { label: "Above ₹2Cr", min: 20000000, max: null },
];

const chip = (active: boolean) =>
  `px-4 py-2 rounded-full border ${
    active ? "bg-blue-600 border-blue-600" : "bg-white border-gray-200"
  }`;

const chipText = (active: boolean) =>
  `text-sm font-semibold ${active ? "text-white" : "text-gray-600"}`;

const FilterModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
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
    resetFilters,
  } = useFilterStore();

  const [localMin, setLocalMin] = useState(minPrice ? String(minPrice) : "");
  const [localMax, setLocalMax] = useState(maxPrice ? String(maxPrice) : "");
  const activeCount = [type, bedrooms, minPrice, maxPrice].filter(
    (v) => v !== null,
  ).length;
  const handelApply = () => {
    setMinPrice(localMin ? Number(localMin) : null);
    setMaxPrice(localMax ? Number(localMax) : null);
    onClose();
  };
  const handelReset = () => {
    setLocalMax("");
    setLocalMin("");
    resetFilters();
    onClose();
  };
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 bg-gray-50`}>
        <View
          style={tw`flex-row items-center justify-between px-5 pt-6 pb-4 bg-white border-b border-gray-100`}
        >
          <TouchableOpacity onPress={onClose} style={tw`p-1 `}>
            <Ionicons name="close" size={22} color="#374151" />
          </TouchableOpacity>

          <Text style={tw`text-lg font-bold text-gray-900 `}>Filters</Text>
          <TouchableOpacity onPress={handelReset}>
            <Text style={tw`text-blue-600 font-semibold text-sm`}>Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={tw`flex-1`}
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={tw`text-base font-bold text-gray-800 mb-3 `}>
            Property Type
          </Text>
          <View style={tw`flex-row flex-wrap gap-2 mb-6`}>
            {TYPES.map((item) => (
              <TouchableOpacity
                key={String(item.value)}
                onPress={() => setType(item.value)}
                style={tw`${chip(type === item.value)} shadow-sm`}
              >
                <Text style={tw`${chipText(type === item.value)} shadow-sm`}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}{" "}
          </View>
          <Text style={tw`text-base font-bold text-gray-800 mb-3 `}>
            Bedrooms
          </Text>
          <View style={tw`flex-row flex-wrap gap-2 mb-6`}>
            {BEDS.map((item) => (
              <TouchableOpacity
                key={String(item.value)}
                onPress={() => setBedrooms(item.value)}
                style={tw`${chip(bedrooms === item.value)} shadow-sm`}
              >
                <Text
                  style={tw`${chipText(bedrooms === item.value)} shadow-sm`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}{" "}
          </View>
          <Text style={tw`text-base font-bold text-gray-800 mb-3 `}>
            Price Range (Rs)
          </Text>
          <View style={tw`flex-row gap-3 mb-3`}>
            {[
              {
                label: "Min Price",
                value: localMin,
                onChange: setLocalMin,
                placeholder: "0",
              },
              {
                label: "Max Price",
                value: localMax,
                onChange: setLocalMax,
                placeholder: "Any",
              },
            ].map(({label,value,onChange,placeholder})=>(
              <View key={label} style={tw`flex-1`}>
                <Text style={tw`text-xs text-gray-500 mb-1.5 font-mdium`}>{label}</Text>
               <View style={tw`flex-row items-center bg-white rounded-2xl px-3 border border-gray-200 shadow-sm`}>
                <Text style={tw`text-gray-400 text-sm mr-1`}>Rs</Text>
                <TextInput style={tw`flex-1 py-3 text-gray-800`} placeholder={placeholder} placeholderTextColor="#9ca3af" keyboardType="numeric" value={value} onChangeText={onChange}></TextInput>
               </View>
              </View>
            ))}
          </View>
          <View style={tw`flex-row flex-wrap gap-2 mb-6`}>
            {PRICE_PRESETS.map((p) => {

              const active=minPrice===p.min&& maxPrice === p.max;
             return <TouchableOpacity
                key={p.label}
                onPress={() => {
                  setLocalMin(p.min? String(p.min):"");
                   setLocalMax(p.max? String(p.max):"");
                   setMinPrice(p.min);
                   setMaxPrice(p.max);
                }}
                style={tw`px-3 py-1.5 rounded-full border ${active?"bg-blue-50 border-blue-300" : "bg-white border-gray-200"}`}
              >
                <Text
                  style={tw`text-xs font-medium ${active?"text-blue-600":"text-gray-500"}`}
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            })}{" "}
          </View>
        </ScrollView>
         <View style={tw`px-5 pb-8 pt-4 bg-white border-t border-gray-100`}>
          <TouchableOpacity style={tw`bg-blue-600 rounded-2xl py-4 items-center shadow-sm elevation`}
          onPress={handelApply}
          
          >
           <Text style={tw`text-white font-bold text-base`}>Apply Filter{activeCount>0?`(${activeCount})`:""}</Text>
          </TouchableOpacity>
         </View>

      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FilterModal;
