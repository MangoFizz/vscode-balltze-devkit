import actor from "./actor.json";
import actor_variant from "./actor_variant.json";
import antenna from "./antenna.json";
import biped from "./biped.json";
import bitfield from "./bitfield.json";
import bitmap from "./bitmap.json";
import camera_track from "./camera_track.json";
import color_table from "./color_table.json";
import continuous_damage_effect from "./continuous_damage_effect.json";
import contrail from "./contrail.json";
import damage_effect from "./damage_effect.json";
import decal from "./decal.json";
import detail_object_collection from "./detail_object_collection.json";
import device_control from "./device_control.json";
import device from "./device.json";
import device_light_fixture from "./device_light_fixture.json";
import device_machine from "./device_machine.json";
import dialogue from "./dialogue.json";
import effect from "./effect.json";
import enums from "./enum.json";
import equipment from "./equipment.json";
import flag from "./flag.json";
import fog from "./fog.json";
import font from "./font.json";
import garbage from "./garbage.json";
import gbxmodel from "./gbxmodel.json";
import globals from "./globals.json";
import glow from "./glow.json";
import grenade_hud_interface from "./grenade_hud_interface.json";
import hud_globals from "./hud_globals.json";
import hud_interface_types from "./hud_interface_types.json";
import hud_message_text from "./hud_message_text.json";
import hud_number from "./hud_number.json";
import input_device_defaults from "./input_device_defaults.json";
import item_collection from "./item_collection.json";
import item from "./item.json";
import lens_flare from "./lens_flare.json";
import light from "./light.json";
import lightning from "./lightning.json";
import light_volume from "./light_volume.json";
import material_effects from "./material_effects.json";
import meter from "./meter.json";
import model_animations from "./model_animations.json";
import model_collision_geometry from "./model_collision_geometry.json";
import model from "./model.json";
import multiplayer_scenario_description from "./multiplayer_scenario_description.json";
import object from "./object.json";
import particle from "./particle.json";
import particle_system from "./particle_system.json";
import physics from "./physics.json";
import placeholder from "./placeholder.json";
import point_physics from "./point_physics.json";
import preferences_network_game from "./preferences_network_game.json";
import projectile from "./projectile.json";
import scenario from "./scenario.json";
import scenario_structure_bsp from "./scenario_structure_bsp.json";
import scenery from "./scenery.json";
import shader_environment from "./shader_environment.json";
import shader from "./shader.json";
import shader_model from "./shader_model.json";
import shader_transparent_chicago_extended from "./shader_transparent_chicago_extended.json";
import shader_transparent_chicago from "./shader_transparent_chicago.json";
import shader_transparent_generic from "./shader_transparent_generic.json";
import shader_transparent_glass from "./shader_transparent_glass.json";
import shader_transparent_meter from "./shader_transparent_meter.json";
import shader_transparent_plasma from "./shader_transparent_plasma.json";
import shader_transparent_water from "./shader_transparent_water.json";
import sky from "./sky.json";
import sound_environment from "./sound_environment.json";
import sound from "./sound.json";
import sound_looping from "./sound_looping.json";
import sound_scenery from "./sound_scenery.json";
import string_list from "./string_list.json";
import tag_collection from "./tag_collection.json";
import ui_widget_definition from "./ui_widget_definition.json";
import unicode_string_list from "./unicode_string_list.json";
import unit_hud_interface from "./unit_hud_interface.json";
import unit from "./unit.json";
import vehicle from "./vehicle.json";
import virtual_keyboard from "./virtual_keyboard.json";
import weapon_hud_interface from "./weapon_hud_interface.json";
import weapon from "./weapon.json";
import weather_particle_system from "./weather_particle_system.json";
import wind from "./wind.json";

const tagDefinitions = {
	actor,
	actor_variant,
	antenna,
	biped,
	bitfield,
	bitmap,
	camera_track,
	color_table,
	continuous_damage_effect,
	contrail,
	damage_effect,
	decal,
	detail_object_collection,
	device_control,
	device,
	device_light_fixture,
	device_machine,
	dialogue,
	effect,
	enums,
	equipment,
	flag,
	fog,
	font,
	garbage,
	gbxmodel,
	globals,
	glow,
	grenade_hud_interface,
	hud_globals,
	hud_interface_types,
	hud_message_text,
	hud_number,
	input_device_defaults,
	item_collection,
	item,
	lens_flare,
	light,
	lightning,
	light_volume,
	material_effects,
	meter,
	model_animations,
	model_collision_geometry,
	model,
	multiplayer_scenario_description,
	object,
	particle,
	particle_system,
	physics,
	placeholder,
	point_physics,
	preferences_network_game,
	projectile,
	scenario,
	scenario_structure_bsp,
	scenery,
	shader_environment,
	shader,
	shader_model,
	shader_transparent_chicago_extended,
	shader_transparent_chicago,
	shader_transparent_generic,
	shader_transparent_glass,
	shader_transparent_meter,
	shader_transparent_plasma,
	shader_transparent_water,
	sky,
	sound_environment,
	sound,
	sound_looping,
	sound_scenery,
	string_list,
	tag_collection,
	ui_widget_definition,
	unicode_string_list,
	unit_hud_interface,
	unit,
	vehicle,
	virtual_keyboard,
	weapon_hud_interface,
	weapon,
	weather_particle_system,
	wind
};

export interface TagStructField {
	name: string;
	type: string;
	classes?: string[];
	struct?: string;
	maximum?: number;
	cache_only?: boolean;
	bounds?: boolean;
	unit?: string;
	non_null?: boolean;
};

export interface TagDataTypeExclude {
	field: string;
}

export interface TagDataType {
	name: string;
	type: "struct"|"bitfield"|"enum";
	class?: string;
	size?: number;
	fields?: TagStructField[] | string[];
	title?: string;
	options?: string[];
	width?: number;
	inherits?: string;
	exclude?: TagDataTypeExclude[];
};

export const tagClasses = {
	actor:  0x61637472,
	actorVariant:  0x61637476,
	antenna:  0x616E7421,
	modelAnimations:  0x616E7472,
	biped:  0x62697064,
	bitmap:  0x6269746D,
	spheroid:  0x626F6F6D,
	continuousDamageEffect:  0x63646D67,
	modelCollisionGeometry:  0x636F6C6C,
	colorTable:  0x636F6C6F,
	contrail:  0x636F6E74,
	deviceControl:  0x6374726C,
	decal:  0x64656361,
	uiWidgetDefinition:  0x44654C61,
	inputDeviceDefaults:  0x64657663,
	device:  0x64657669,
	detailObjectCollection:  0x646F6263,
	effect:  0x65666665,
	equipment:  0x65716970,
	flag:  0x666C6167,
	fog:  0x666F6720,
	font:  0x666F6E74,
	materialEffects:  0x666F6F74,
	garbage:  0x67617262,
	glow:  0x676C7721,
	grenadeHudInterface:  0x67726869,
	hudMessageText:  0x686D7420,
	hudNumber:  0x68756423,
	hudGlobals:  0x68756467,
	item:  0x6974656D,
	itemCollection:  0x69746D63,
	damageEffect:  0x6A707421,
	lensFlare:  0x6C656E73,
	lightning:  0x656C6563,
	deviceLightFixture:  0x6C696669,
	light:  0x6C696768,
	soundLooping:  0x6C736E64,
	deviceMachine:  0x6D616368,
	globals:  0x6D617467,
	meter:  0x6D657472,
	lightVolume:  0x6D677332,
	gbxmodel:  0x6D6F6432,
	model:  0x6D6F6465,
	multiplayerScenarioDescription:  0x6D706C79,
	null:  0xFFFFFFFF,
	preferencesNetworkGame:  0x6E677072,
	object:  0x6F626A65,
	particle:  0x70617274,
	particleSystem:  0x7063746C,
	physics:  0x70687973,
	placeholder:  0x706C6163,
	pointPhysics:  0x70706879,
	projectile:  0x70726F6A,
	weatherParticleSystem:  0x7261696E,
	scenarioStructureBsp:  0x73627370,
	scenery:  0x7363656E,
	shaderTransparentChicagoExtended:  0x73636578,
	shaderTransparentChicago:  0x73636869,
	scenario:  0x73636E72,
	shaderEnvironment:  0x73656E76,
	shaderTransparentGlass:  0x73676C61,
	shader:  0x73686472,
	sky:  0x736B7920,
	shaderTransparentMeter:  0x736D6574,
	sound:  0x736E6421,
	soundEnvironment:  0x736E6465,
	shaderModel:  0x736F736F,
	shaderTransparentGeneric:  0x736F7472,
	uiWidgetCollection:  0x536F756C,
	shaderTransparentPlasma:  0x73706C61,
	soundScenery:  0x73736365,
	stringList:  0x73747223,
	shaderTransparentWater:  0x73776174,
	tagCollection:  0x74616763,
	cameraTrack:  0x7472616B,
	dialogue:  0x75646C67,
	unitHudInterface:  0x756E6869,
	unit:  0x756E6974,
	unicodeStringList:  0x75737472,
	virtualKeyboard:  0x76636B79,
	vehicle:  0x76656869,
	weapon:  0x77656170,
	wind:  0x77696E64,
	weaponHudInterface:  0x77706869,
};

const definitions = Object.values(tagDefinitions).reduce((acc, val) => acc.concat(val as TagDataType[]), [] as TagDataType[]);

export default definitions;
