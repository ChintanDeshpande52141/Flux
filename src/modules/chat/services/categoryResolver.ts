import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Category,
  CategoryMemory,
  initialCategoryMemory,
} from "../data/categoryMemory";

export type { Category };

const CATEGORY_MEMORY_KEY = "flux_category_memory";

/**
 * Resolve category for a given description
 * First checks local memory, then returns "Others" for unknown
 */
export async function resolveCategory(description: string): Promise<Category> {
  const cleanDescription = description.toLowerCase().trim();

  // Load category memory from storage
  const memory = await loadCategoryMemory();

  // Check exact match first
  if (memory[cleanDescription]) {
    return memory[cleanDescription];
  }

  // Check partial matches (contains)
  for (const [key, category] of Object.entries(memory)) {
    if (cleanDescription.includes(key) || key.includes(cleanDescription)) {
      // Save the new mapping for future use
      memory[cleanDescription] = category;
      await saveCategoryMemory(memory);
      return category;
    }
  }

  // Return "Others" for unknown categories
  // AI classification can be added here in the future
  return "Others";
}

/**
 * Load category memory from AsyncStorage
 */
export async function loadCategoryMemory(): Promise<CategoryMemory> {
  try {
    const stored = await AsyncStorage.getItem(CATEGORY_MEMORY_KEY);
    if (stored) {
      const memory = JSON.parse(stored);
      // Merge with initial memory to ensure we have all default mappings
      return { ...initialCategoryMemory, ...memory };
    }
  } catch (error) {
    console.error("Error loading category memory:", error);
  }

  return initialCategoryMemory;
}

/**
 * Save category memory to AsyncStorage
 */
export async function saveCategoryMemory(
  memory: CategoryMemory,
): Promise<void> {
  try {
    await AsyncStorage.setItem(CATEGORY_MEMORY_KEY, JSON.stringify(memory));
  } catch (error) {
    console.error("Error saving category memory:", error);
  }
}

/**
 * Add new category mapping
 * Used by the learning system
 */
export async function addCategoryMapping(
  description: string,
  category: Category,
): Promise<void> {
  const memory = await loadCategoryMemory();
  const cleanDescription = description.toLowerCase().trim();

  // Only add if not already mapped
  if (!memory[cleanDescription]) {
    memory[cleanDescription] = category;
    await saveCategoryMemory(memory);
  }
}

/**
 * Get all category mappings (for debugging/export)
 */
export async function getAllCategoryMappings(): Promise<CategoryMemory> {
  return await loadCategoryMemory();
}

/**
 * Clear category memory (reset to defaults)
 */
export async function clearCategoryMemory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(CATEGORY_MEMORY_KEY);
  } catch (error) {
    console.error("Error clearing category memory:", error);
  }
}
