use frame_support::traits::ConstU64;

use crate::*;

impl pallet_timestamp::Config for Runtime {
	/// A timestamp: milliseconds since the unix epoch.
	type Moment = u64;
	type OnTimestampSet = Aura;
	type MinimumPeriod = ConstU64<{ SLOT_DURATION / 2 }>;
	type WeightInfo = pallet_timestamp::weights::SubstrateWeight<Runtime>;
}
