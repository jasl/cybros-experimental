// This file is part of Cybros.

// Copyright (C) Jun Jiang.
// SPDX-License-Identifier: AGPL-3.0-only

// Cybros is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Cybros is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with Cybros.  If not, see <http://www.gnu.org/licenses/>.

use crate as pallet_offchain_computing_pool;

use frame_support::{
	assert_ok, derive_impl,
	traits::{OnFinalize, OnInitialize},
};
use frame_system::EnsureSigned;
use sp_core::{ConstBool, ConstU128, ConstU32, ConstU64};
use sp_runtime::{
	traits::{IdentifyAccount, IdentityLookup, Verify},
	BuildStorage, MultiSignature,
};

type Block = frame_system::mocking::MockBlock<Test>;

pub(crate) type Balance = u128;

pub(crate) type Signature = MultiSignature;
pub(crate) type AccountPublic = <Signature as Verify>::Signer;
pub(crate) type AccountId = <AccountPublic as IdentifyAccount>::AccountId;

pub(crate) const INIT_TIMESTAMP: u64 = 30_000;
pub(crate) const BLOCK_TIME: u64 = 1000;

pub(crate) const MILLI_CENTS: Balance = 1_000_000;
pub(crate) const CENTS: Balance = 1_000 * MILLI_CENTS;
pub(crate) const DOLLARS: Balance = 100 * CENTS;

// Configure a mock runtime to test the pallet.
frame_support::construct_runtime!(
	pub struct Test {
		System: frame_system,
		Balances: pallet_balances,
		Timestamp: pallet_timestamp,
		Randomness: pallet_insecure_randomness_collective_flip,
		OffchainComputingInfra: pallet_offchain_computing_infra,
		OffchainComputingPool: pallet_offchain_computing_pool,
	}
);

#[derive_impl(frame_system::config_preludes::TestDefaultConfig)]
impl frame_system::Config for Test {
	type AccountId = AccountId;
	type Lookup = IdentityLookup<Self::AccountId>;
	type Block = Block;
	type AccountData = pallet_balances::AccountData<Balance>;
}

#[derive_impl(pallet_balances::config_preludes::TestDefaultConfig)]
impl pallet_balances::Config for Test {
	type AccountStore = System;
	type Balance = Balance;
	type ExistentialDeposit = ConstU128<{ CENTS }>;
}

impl pallet_timestamp::Config for Test {
	type Moment = u64;
	type OnTimestampSet = ();
	type MinimumPeriod = ConstU64<5>;
	type WeightInfo = ();
}

impl pallet_insecure_randomness_collective_flip::Config for Test {}

impl pallet_offchain_computing_infra::Config for Test {
	type RuntimeEvent = RuntimeEvent;
	type RuntimeHoldReason = RuntimeHoldReason;
	type Currency = Balances;
	type UnixTime = Timestamp;
	type Randomness = Randomness;
	type ImplId = u32;
	type RegisterImplOrigin = EnsureSigned<Self::AccountId>;
	type RegisterWorkerDeposit = ConstU128<{ 100 * DOLLARS }>;
	type RegisterImplDeposit = ConstU128<{ DOLLARS }>;
	type ImplMetadataDepositBase = ConstU128<{ DOLLARS }>;
	type ImplMetadataDepositPerByte = ConstU128<{ CENTS }>;
	type ImplMetadataLimit = ConstU32<50>;
	type MaxImplBuilds = ConstU32<4>;
	type HandleUnresponsivePerBlockLimit = ConstU32<3>;
	type CollectingHeartbeatsDurationInBlocks = ConstU32<6>;
	type DisallowOptOutAttestation = ConstBool<false>;
	type WeightInfo = ();
	type OffchainWorkerLifecycleHooks = OffchainComputingPool;
}

impl pallet_offchain_computing_pool::Config for Test {
	type RuntimeEvent = RuntimeEvent;
	type RuntimeHoldReason = RuntimeHoldReason;
	type Currency = Balances;
	type PoolId = u32;
	type JobId = u32;
	type PolicyId = u32;
	type CreatePoolOrigin = EnsureSigned<Self::AccountId>;
	type PoolCreationDeposit = ConstU128<{ DOLLARS }>;
	type JobCreationDeposit = ConstU128<{ DOLLARS }>;
	type JobStorageDepositPerByte = ConstU128<{ CENTS }>;
	type PoolMetadataDepositBase = ConstU128<{ CENTS }>;
	type PoolMetadataDepositPerByte = ();
	type MaxAssignedJobsPerWorker = ConstU32<8>;
	type MaxSubscribedPoolsPerWorker = ConstU32<8>;
	type MaxPoliciesPerPool = ConstU32<3>;
	type MaxJobsPerPool = ConstU32<100>;
	type MaxWorkersPerPool = ConstU32<100>;
	type MinJobExpiresIn = ConstU64<6>;
	type MaxJobExpiresIn = ConstU64<24>;
	type DefaultJobExpiresIn = ConstU64<18>;
	type PoolMetadataLimit = ConstU32<50>;
	type InputLimit = ConstU32<50>;
	type OutputLimit = ConstU32<50>;
	type ProofLimit = ConstU32<50>;
}

// Build genesis storage according to the mock runtime.
#[allow(unused)]
pub(crate) fn new_test_ext() -> sp_io::TestExternalities {
	let mut t = frame_system::GenesisConfig::<Test>::default().build_storage().unwrap();
	// Customize genesis config here
	t.into()
}

#[allow(unused)]
pub(crate) fn run_to_block(n: u64) {
	// NOTE that this function only simulates modules of interest. Depending on new pallet may
	// require adding it here.
	assert!(System::block_number() < n);

	for b in (System::block_number() + 1)..=n {
		System::set_block_number(b);
		System::on_initialize(System::block_number());
		Timestamp::set_timestamp(System::block_number() * BLOCK_TIME + INIT_TIMESTAMP);
		if b != n {
			System::on_finalize(System::block_number());
		}
	}
}

#[allow(unused)]
pub(crate) fn take_events() -> Vec<RuntimeEvent> {
	let events = System::events().into_iter().map(|i| i.event).collect::<Vec<_>>();
	System::reset_events();
	events
}

#[allow(unused)]
pub(crate) fn set_balance(who: AccountId, new_free: Balance, new_reserved: Balance) {
	assert_ok!(Balances::force_set_balance(
		RuntimeOrigin::root(),
		who.clone(),
		new_free.saturating_add(new_reserved)
	));
	assert_eq!(Balances::free_balance(&who), new_free);
	assert_eq!(Balances::reserved_balance(&who), new_reserved);
}
