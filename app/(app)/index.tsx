import { useSession } from "@/context/ctx";
import { useDebounce } from "@/hooks/useDebounce";
import { router } from "expo-router";
import { LogOut, Search, SlidersHorizontal, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
interface Pokemon {
  id: number;
  name: string;
  url: string;
  images: string;
  types: string[];
}
type PokemonType = keyof typeof pokemonColors;
export const pokemonColors = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C", // Ini yang akan dipakai Bulbasaur
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  steel: "#B7B7CE",
  fairy: "#D685AD",
} as any;
export default function Index() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debaouceSearch = useDebounce<string>(search);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string | null>("");
  const { session, clearSession } = useSession();
  const fetchPokemons = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=10",
      );
      const data = await response.json();

      const detailedPokemon = await Promise.all(
        data.results.map(async (pokemon: Pokemon) => {
          const res = await fetch(pokemon.url);
          const detail: {
            id: number;
            sprites: { front_default: string };
            types: { name: string }[];
          } = await res.json();
          return {
            id: detail.id,
            name: pokemon.name,
            images: detail.sprites.front_default,
            types: detail.types.map((t: any) => t.type.name),
          };
        }),
      );
      setPokemons(detailedPokemon);
    } catch (error) {
      setError("Failed to fetch Pokémons.");
      console.error("Error fetching Pokemons:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchSinglePokemon = async (q: string) => {
    setLoading(true);
    setError(null);
    setPokemons([]);
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${q.trim().toLowerCase()}`,
      );
      if (!response.ok) throw new Error("Not Found");
      const data = await response.json();
      const pokemon: Pokemon = {
        id: data.id,
        name: data.name,
        images: data.sprites.front_default,
        types: data.types.map((t: any) => t.type.name),
        url: "",
      };

      setPokemons([pokemon]);
    } catch (error) {
      setError(`Pokémon "${debaouceSearch}" not found.`);
      console.error("Error fetching Pokemons:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchPokemonByType = async (q: string) => {
    setLoading(true);
    setError(null);
    setPokemons([]);
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/type/${q}?limit=10`,
      );
      const data = await response.json();
      const detailedPokemon = await Promise.all(
        data.pokemon.map(async (item: any) => {
          const res = await fetch(item.pokemon.url);
          const detail: {
            id: number;
            sprites: { front_default: string };
            types: { name: string }[];
          } = await res.json();
          return {
            id: detail.id,
            name: item.pokemon.name,
            images: detail.sprites.front_default,
            types: detail.types.map((t: any) => t.type.name),
          };
        }),
      );
      setPokemons(detailedPokemon);
    } catch (error) {
      setError("Failed to fetch Pokémons.");
      console.error("Error fetching Pokemons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetByType = (type: string | null) => {
    if (type) {
      setModalVisible(false);
      fetchPokemonByType(type);
    } else {
      fetchPokemons();
    }
  };
  useEffect(() => {
    if (debaouceSearch.trim().length === 0) {
      fetchPokemons();
    } else {
      fetchSinglePokemon(debaouceSearch);
    }
  }, [debaouceSearch]);

  const handleLogout = () => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancle", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => clearSession(),
      },
    ]);
  };
  return (
    <SafeAreaView className="flex-1">
      <View className="px-4 py-2 mb-2">
        <View className="flex flex-row items-center gap-2 justify-between">
          <Text className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Pokédex
          </Text>
          <TouchableOpacity onPress={handleLogout}>
            {/* <Text>Signout</Text> */}
            <LogOut color="red" size={20} />
          </TouchableOpacity>
        </View>
        {/* 3. Tampilkan Nama User di sini */}
        <Text className="text-gray-500 text-base font-medium my-1">
          Hello, {session?.name || "Trainer"}! 👋
        </Text>
        <View className="flex flex-row items-center mt-2 gap-2 ">
          <View className="rounded-xl border py-3 px-4 border-gray-200 bg-gray-100 flex flex-row items-center gap-2 flex-1">
            <Search color="gray" size={18} />
            <TextInput
              className="text-base text-gray-800 font-medium flex-1"
              placeholder="Search your pokemon"
              value={search}
              onChangeText={setSearch}
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="bg-gray-100 p-3 rounded-xl border border-gray-200 items-center justify-center"
          >
            <SlidersHorizontal color="#9CA3AF" size={18} />
          </TouchableOpacity>
        </View>
      </View>
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#EE8130" />
          <Text className="text-gray-500 mt-4 font-medium">Searching...</Text>
        </View>
      ) : (
        <FlatList
          data={pokemons}
          keyExtractor={(pokemon) => pokemon.name}
          contentContainerClassName="gap-4"
          columnWrapperClassName="gap-2"
          className="p-4"
          numColumns={2}
          ListEmptyComponent={
            <View className="items-center justify-center mt-10 px-8 flex-1">
              <Text className="text-gray-800 text-lg font-bold text-center mb-1">
                Oops!
              </Text>
              <Text className="text-gray-500 text-center">
                {error || "No Pokémon found."}
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const mainType = item.types[0];
            // Fallback ke bg-gray-500 jika tipe tidak ditemukan
            const bgColor = pokemonColors[mainType] || "#A8A8A8";
            return (
              <TouchableOpacity
                activeOpacity={0.9}
                // 3. Arahkan ke folder pokemon dengan membawa ID
                onPress={() => router.push(`/pokemon/${item.id}`)}
                style={{ backgroundColor: bgColor }}
                className="flex-1 items-center border pb-8 border-gray-200 rounded-3xl relative overflow-hidden shadow-sm"
              >
                <Image
                  source={{ uri: item.images }}
                  className="w-full aspect-square"
                  width={200}
                  height={200}
                  resizeMode="contain"
                />
                <Text className="text-white text-lg font-bold capitalize mt-1">
                  {item.name}
                </Text>
                <Text className="absolute right-2 top-2 text-white/50 font-bold text-xs">
                  #{String(item.id).padStart(3, "0")}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      )}

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection={["down"]}
        style={{ margin: 0, justifyContent: "flex-end" }}
        backdropTransitionOutTiming={1}
        backdropTransitionInTiming={1}
      >
        <View className="bg-white rounded-xl p-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-gray-900">
              Filter Type
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <View className="flex-row flex-wrap gap-3">
            {Object.keys(pokemonColors).map((type) => {
              const isSelected = selectedType === type;
              const typeColor = pokemonColors[type as PokemonType];

              return (
                <TouchableOpacity
                  key={type}
                  onPress={() => setSelectedType(isSelected ? null : type)}
                  style={{
                    backgroundColor: isSelected ? typeColor : "#F3F4F6",
                    borderColor: isSelected ? typeColor : "transparent",
                  }}
                  className="px-4 py-2 rounded-full border-2"
                >
                  <Text
                    className={`font-bold capitalize ${
                      isSelected ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View className="mt-2 flex-row gap-4 pt-4 border-t border-gray-100">
            <TouchableOpacity
              onPress={() => setSelectedType(null)}
              className="flex-1 bg-gray-100 py-4 rounded-xl items-center"
            >
              <Text className="text-gray-700 font-bold text-lg">Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleGetByType(selectedType)}
              className="flex-1 bg-blue-600 py-4 rounded-xl items-center shadow-lg shadow-blue-200"
            >
              <Text className="text-white font-bold text-lg">Show Results</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
