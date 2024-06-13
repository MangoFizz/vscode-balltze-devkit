interface MetaEnginePlayer {
	name: string
	objectivePlayerHandle: ObjectivePlayerHandle
	weaponSwapResult: boolean
	lastDeathTime: number
	unknownHandle: ObjectivePlayerHandle
	assists: number[]
	position: Position
	interactionObjectType: number
	multiplayerStatistics: MultiplayerStatistics
	playerId: number
	betrays: number
	teamKillTicksSinceLast: number
	lastFireTime: number
	name2: string
	baselineUpdateGrenadeSlot: number
	action: string
	flashlight: string
	ping: number
	suicides: number
	interactionObjectHandle: ObjectivePlayerHandle
	machineIndex: number
	melee: string
	killStreak: number
	iconIndex: number
	index: number
	color: string
	controllerIndex: number
	teleporterFlagHandle: ObjectivePlayerHandle
	kills: number[]
	speed: number
	baselineUpdateZAim: number
	localHandle: number
	teamKills: number
	deaths: number
	respawnTime: number
	quitTime: number
	bspClusterId: number
	baselineUpdateForward: number
	otherPowerupTimeLeft: number
	updateAiming: Position
	interactionObjectSeat: number
	baselineUpdateLeft: number
	team2: number
	lastKillTime: number
	baselineUpdateWeaponSlot: number
	team: number
	updatePosition: Position
	quit: boolean
	teamKillCount: number
	baselineUpdateXyAim: number
	telefragDanger: boolean
	invisibilityTime: number
	targetTime: number
	oddManOut: boolean
	baselineUpdateRateOfFire: number
	multikill: number
	objectHandle: ObjectivePlayerHandle
	telefragTimer: number
	reload: string
	objectiveMode: string
	slayerTarget: ObjectivePlayerHandle
	targetPlayer: ObjectivePlayerHandle
	autoAimTargetObject: ObjectivePlayerHandle
	prevObjectHandle: ObjectivePlayerHandle
	respawnTimeGrowth: number
}

// TODO Port rest of sub interfaces from MetaEnginePlayer with an automated EmmyLua to TS script

interface MultiplayerStatistics {
	oddballTargetKills: number
	ctfFlagReturns: number
	oddballKills: number
	kothHillScore: number
	raceBestTime: number
	raceTime: number
	raceLaps: number
	ctfFlagScores: number
	ctfFlagGrabs: number
}

interface Position {
	z: number
	y: number
	x: number
}

interface ObjectivePlayerHandle {
	id: number
	index: number
	value: number
}

export default MetaEnginePlayer
