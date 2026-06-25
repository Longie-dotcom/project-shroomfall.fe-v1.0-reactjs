import React from 'react';
import { 
  CollisionForm, 
  AIForm, 
  LifetimeForm, 
  PortalForm, 
  ProjectileForm, 
  InteractableForm, 
  AppearanceForm, 
  TriggeredEffectForm, 
  InventoryForm, 
  CharacteristicForm 
} from './EntityForms';

export const ComponentRegistry: Record<string, { title: string; component: React.FC<any> }> = {
  'CollisionDefinitionDTO': { title: 'Collision Geometry', component: CollisionForm },
  'AIDefinitionDTO': { title: 'AI Brain Configuration', component: AIForm },
  'LifetimeDefinitionDTO': { title: 'Temporal Volatility Lifetime', component: LifetimeForm },
  'PortalDefinitionDTO': { title: 'Zone Portal Boundary', component: PortalForm },
  'ProjectileDefinitionDTO': { title: 'Ballistics Projectile Engine', component: ProjectileForm },
  'InteractableDefinitionDTO': { title: 'Object Interaction Layer', component: InteractableForm },
  'AppearanceDefinitionDTO': { title: 'Visual Rendering & Customization Skin', component: AppearanceForm },
  'TriggeredEffectDefinitionDTO': { title: 'Trigger Event Pipelines', component: TriggeredEffectForm },
  'InventoryDefinitionDTO': { title: 'Inventory Data Store', component: InventoryForm },
  'CharacteristicDefinitionDTO': { title: 'RPG Characteristic Engine', component: CharacteristicForm },
};

export const EntitySchemaRules: Record<any, string[]> = {
  AreaEffect: ['CollisionDefinitionDTO', 'LifetimeDefinitionDTO', 'TriggeredEffectDefinitionDTO'],
  Portal: ['CollisionDefinitionDTO', 'PortalDefinitionDTO'],
  Projectile: ['CollisionDefinitionDTO', 'LifetimeDefinitionDTO', 'TriggeredEffectDefinitionDTO', 'ProjectileDefinitionDTO'],
  WorldObject: ['CollisionDefinitionDTO', 'InteractableDefinitionDTO'],
  Creature: ['CollisionDefinitionDTO', 'CharacteristicDefinitionDTO', 'InventoryDefinitionDTO', 'AppearanceDefinitionDTO', 'AIDefinitionDTO'],
  Player: ['CollisionDefinitionDTO', 'CharacteristicDefinitionDTO', 'InventoryDefinitionDTO', 'AppearanceDefinitionDTO'],
  Item: ['CollisionDefinitionDTO'],
};