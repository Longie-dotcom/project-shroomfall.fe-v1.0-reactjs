import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../clients/apiClient';

// --- Type Imports ---
import type { ExistLocalesDTO } from '../../contracts/design/responses/exist-locales-dto';
import type { DefinitionSnapshotDTO } from '../../contracts/design/responses/definition-snapshot-dto';
import type { UpdateDefinitionDTO } from '../../contracts/design/commands/update-definition-dto';
import type { PagedResponseDTO } from '../../contracts/common/paged-response-dto';

// Entity DTOs
import type { UpsertEntityDefinitionDTO } from '../../contracts/design/commands/upsert-entity-definition-dto';
import type { EntityDefinitionDTO } from '../../contracts/domain/definition/entity/entity-definition-dto';
import type { EntityDefinitionDetailDTO } from '../../contracts/domain/definition/entity/entity-definition-detail-dto';
import type { EntityDefinitionQueryDTO } from '../../contracts/design/commands/entity-definition-query-dto';

// Missing: Effect DTOs (Adjust paths to match your actual project structure)
import type { EffectDefinitionDTO } from '../../contracts/domain/definition/meta/effect-definition-dto';
import type { EffectDefinitionQueryDTO } from '../../contracts/design/commands/effect-definition-query-dto';
import type { UpsertEffectDefinitionDTO } from '../../contracts/design/commands/upsert-effect-definition-dto';

// Missing: Item DTOs (Adjust paths to match your actual project structure)
import type { ItemDefinitionDTO } from '../../contracts/domain/definition/meta/item-definition-dto';
import type { ItemDefinitionQueryDTO } from '../../contracts/design/commands/item-definition-query-dto';
import type { UpsertItemDefinitionDTO } from '../../contracts/design/commands/upsert-item-definition-dto';


// --- Query Keys ---
export const DESIGN_QUERY_KEYS = {
  LOCALES: ['design', 'locales'] as const,
  SNAPSHOT: (version: string) => ['design', 'snapshot', version] as const,

  // Entities Cache Roots
  ENTITIES: ['design', 'entities'] as const,
  ENTITIES_LIST: (queries: EntityDefinitionQueryDTO) => ['design', 'entities', 'list', queries] as const,
  ENTITY_DETAIL: (id: string) => ['design', 'entities', 'detail', id] as const,

  // Missing: Effects Cache Roots
  EFFECTS: ['design', 'effects'] as const,
  EFFECTS_LIST: (queries: EffectDefinitionQueryDTO) => ['design', 'effects', 'list', queries] as const,

  // Missing: Items Cache Roots
  ITEMS: ['design', 'items'] as const,
  ITEMS_LIST: (queries: ItemDefinitionQueryDTO) => ['design', 'items', 'list', queries] as const,
};


// ==========================================
// --- QUERIES (Read Actions) ---
// ==========================================

/**
 * 1. Get Locales (GET /api/design/locale)
 */
export const useDesignLocales = () => {
  return useQuery({
    queryKey: DESIGN_QUERY_KEYS.LOCALES,
    queryFn: async (): Promise<ExistLocalesDTO> => {
      const { data } = await apiClient.get<ExistLocalesDTO>('/design/locale');
      return data;
    },
  });
};

/**
 * 2. Get Snapshot / User Refresh (GET /api/design/{version})
 */
export const useDesignSnapshot = (version: string) => {
  return useQuery({
    queryKey: DESIGN_QUERY_KEYS.SNAPSHOT(version),
    queryFn: async (): Promise<DefinitionSnapshotDTO | null> => {
      const { data } = await apiClient.get<DefinitionSnapshotDTO | null>(`/design/${version}`);
      return data;
    },
    enabled: !!version,
  });
};

/**
 * 3. Fetch All Entities (GET /api/design/entities)
 */
export const useDesignAllEntities = (queries: EntityDefinitionQueryDTO) => {
  return useQuery({
    queryKey: DESIGN_QUERY_KEYS.ENTITIES_LIST(queries),
    queryFn: async (): Promise<PagedResponseDTO<EntityDefinitionDTO>> => {
      const { data } = await apiClient.get<PagedResponseDTO<EntityDefinitionDTO>>('/design/entities', {
        params: queries,
      });
      return data;
    },
  });
};

/**
 * 4. Fetch Entity Definition Detail (GET /api/design/entities/{id})
 */
export const useDesignEntityDetail = (id: string) => {
  return useQuery({
    queryKey: DESIGN_QUERY_KEYS.ENTITY_DETAIL(id),
    queryFn: async (): Promise<EntityDefinitionDetailDTO> => {
      const { data } = await apiClient.get<EntityDefinitionDetailDTO>(`/design/entities/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

/**
 * 5. Fetch All Effects (GET /api/design/effects)
 */
export const useDesignAllEffects = (queries: EffectDefinitionQueryDTO) => {
  return useQuery({
    queryKey: DESIGN_QUERY_KEYS.EFFECTS_LIST(queries),
    queryFn: async (): Promise<PagedResponseDTO<EffectDefinitionDTO>> => {
      const { data } = await apiClient.get<PagedResponseDTO<EffectDefinitionDTO>>('/design/effects', {
        params: queries,
      });
      return data;
    },
  });
};

/**
 * 6. Fetch All Items (GET /api/design/items)
 */
export const useDesignAllItems = (queries: ItemDefinitionQueryDTO) => {
  return useQuery({
    queryKey: DESIGN_QUERY_KEYS.ITEMS_LIST(queries),
    queryFn: async (): Promise<PagedResponseDTO<ItemDefinitionDTO>> => {
      const { data } = await apiClient.get<PagedResponseDTO<ItemDefinitionDTO>>('/design/items', {
        params: queries,
      });
      return data;
    },
  });
};


// ==========================================
// --- MUTATIONS (Write Actions) ---
// ==========================================

/**
 * 7. Update Definition (POST /api/design/definition)
 */
export const useUpdateDesignDefinition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: UpdateDefinitionDTO): Promise<void> => {
      await apiClient.post('/design/definition', dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['design'] });
    },
  });
};

/**
 * 8. Upsert Entity Definition (POST /api/design/entity-definition)
 */
export const useUpsertEntityDefinition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: UpsertEntityDefinitionDTO): Promise<void> => {
      await apiClient.post('/design/entity-definition', dto);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: DESIGN_QUERY_KEYS.ENTITIES });
      if (variables.iD) {
        queryClient.invalidateQueries({ queryKey: DESIGN_QUERY_KEYS.ENTITY_DETAIL(variables.iD) });
      }
      queryClient.invalidateQueries({ queryKey: DESIGN_QUERY_KEYS.LOCALES });
    },
  });
};

/**
 * 9. Upsert Effect Definition (POST /api/design/effect-definition)
 */
export const useUpsertEffectDefinition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: UpsertEffectDefinitionDTO): Promise<void> => {
      await apiClient.post('/design/effect-definition', dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: DESIGN_QUERY_KEYS.EFFECTS,
        exact: false,
      });

      queryClient.invalidateQueries({
        queryKey: DESIGN_QUERY_KEYS.LOCALES,
        exact: false,
      });
    },
  });
};

/**
 * 10. Upsert Item Definition (POST /api/design/item-definition)
 */
export const useUpsertItemDefinition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: UpsertItemDefinitionDTO): Promise<void> => {
      await apiClient.post('/design/item-definition', dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['design', 'items'],
        exact: false
      });
      queryClient.invalidateQueries({ queryKey: DESIGN_QUERY_KEYS.LOCALES });
    },
  });
};