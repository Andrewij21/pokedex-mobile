import { router, Stack, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { pokemonColors } from "../index"; // Import warna dari index (atau pindahkan colors ke file constants terpisah)

// Interface untuk Detail Lengkap (Stats, Height, Weight)
interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    other: { "official-artwork": { front_default: string } }; // Gambar HD
  };
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  abilities: { ability: { name: string } }[];
}

export default function PokemonDetail() {
  // 1. Tangkap ID dari URL
  const { id } = useLocalSearchParams();

  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchPokemonDetail();
  }, [id]);

  const fetchPokemonDetail = async () => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await response.json();
      setPokemon(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Helper untuk warna
  const getTypeColor = (type: string) => {
    return pokemonColors[type as keyof typeof pokemonColors] || "#A8A8A8";
  };

  if (loading || !pokemon) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#EE8130" />
      </View>
    );
  }

  const mainType = pokemon.types[0].type.name;
  const bgColor = getTypeColor(mainType);

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: "",

          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()} // Aksi kembali
              className="bg-white/20 p-2 rounded-full ml-[-8px]" // Style tombol (Kaca transparan)
              activeOpacity={0.7}
            >
              {/* Icon Lucide Konsisten */}
              <ChevronLeft color="white" size={28} />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Bagian Atas (Background Warna) */}
      <View
        style={{ backgroundColor: bgColor }}
        className="h-[45%] items-center justify-end rounded-b-[50px] overflow-visible z-10"
      >
        <Image
          // Pakai gambar Official Artwork biar HD
          source={{
            uri:
              pokemon.sprites.other["official-artwork"].front_default ||
              pokemon.sprites.front_default,
          }}
          className="w-64 h-64 -mb-10"
          resizeMode="contain"
        />
      </View>

      {/* Bagian Bawah (Info) */}
      <ScrollView className="mt-12 px-6 pt-4">
        {/* Nama & ID */}
        <View className="items-center mb-6">
          <Text className="text-3xl font-extrabold capitalize text-gray-800">
            {pokemon.name}
          </Text>
          <View
            className={`px-4 py-1 rounded-full mt-2`}
            style={{ backgroundColor: bgColor }}
          >
            <Text className="text-white font-bold capitalize">{mainType}</Text>
          </View>
        </View>

        {/* Berat & Tinggi */}
        <View className="flex-row justify-center gap-8 mb-8">
          <View className="items-center">
            <Text className="text-gray-500 text-sm font-bold">Weight</Text>
            <Text className="text-xl font-bold text-gray-800">
              {pokemon.weight / 10} kg
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-gray-500 text-sm font-bold">Height</Text>
            <Text className="text-xl font-bold text-gray-800">
              {pokemon.height / 10} m
            </Text>
          </View>
        </View>

        {/* Base Stats */}
        <Text className="text-xl font-bold text-gray-800 mb-4">Base Stats</Text>
        <View className="gap-3 pb-10">
          {pokemon.stats.map((stat) => (
            <View key={stat.stat.name} className="flex-row items-center">
              <Text className="w-24 text-gray-500 capitalize font-medium">
                {stat.stat.name.replace("-", " ")}
              </Text>
              <Text className="w-10 font-bold text-gray-800 text-right mr-3">
                {stat.base_stat}
              </Text>
              {/* Progress Bar */}
              <View className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(stat.base_stat, 100)}%`,
                    backgroundColor: bgColor,
                  }}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
