use frame_support::traits::{ConstBool, ConstU32};
use sp_consensus_aura::sr25519::AuthorityId as AuraId;

use crate::*;

impl pallet_aura::Config for Runtime {
	type AuthorityId = AuraId;
	type DisabledValidators = ();
	type MaxAuthorities = ConstU32<32>;
	type AllowMultipleBlocksPerSlot = ConstBool<false>;
	type SlotDuration = pallet_aura::MinimumPeriodTimesTwo<Runtime>;
}