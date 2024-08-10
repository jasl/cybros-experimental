use crate::{mock::*, Error, Something};
use frame_support::{assert_noop, assert_ok};

type AccountIdOf<Test> = <Test as frame_system::Config>::AccountId;

fn account(id: u8) -> AccountIdOf<Test> {
	[id; 32].into()
}

#[test]
fn it_works_for_default_value() {
	new_test_ext().execute_with(|| {
		// Dispatch a signed extrinsic.
		assert_ok!(ComputableWorkers::do_something(RuntimeOrigin::signed(account(1)), 42));
		// Read pallet storage and assert an expected result.
		assert_eq!(Something::<Test>::get().map(|v| v.block_number), Some(42));
	});
}

#[test]
fn correct_error_for_none_value() {
	new_test_ext().execute_with(|| {
		// Ensure the expected error is thrown when no value is present.
		assert_noop!(
			ComputableWorkers::cause_error(RuntimeOrigin::signed(account(1))),
			Error::<Test>::NoneValue
		);
	});
}
