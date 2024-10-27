use runtime::WASM_BINARY;
use sc_service::ChainType;
use sc_chain_spec::Properties;

/// Specialized `ChainSpec`. This is a specialization of the general Substrate ChainSpec type.
pub type ChainSpec = sc_service::GenericChainSpec;

fn chain_properties() -> Properties {
	let mut p = Properties::new();

	p.insert("tokenSymbol".into(), "CBT".into());
	p.insert("tokenDecimals".into(), 12.into());
	p.insert("ss58Format".into(), 42.into());

	p
}

pub fn development_chain_spec() -> Result<ChainSpec, String> {
	Ok(ChainSpec::builder(
		WASM_BINARY.ok_or_else(|| "Development wasm not available".to_string())?,
		None,
	)
	.with_name("Cybros Development Network")
	.with_id("cybros_dev")
	.with_protocol_id("cybros_dev")
	.with_chain_type(ChainType::Development)
	.with_properties(chain_properties())
	.with_genesis_config_preset_name(sp_genesis_builder::DEV_RUNTIME_PRESET)
	.build())
}

pub fn local_chain_spec() -> Result<ChainSpec, String> {
	Ok(ChainSpec::builder(
		WASM_BINARY.ok_or_else(|| "Development wasm not available".to_string())?,
		None,
	)
	.with_name("Cybros Local Network")
	.with_id("cybros_local")
	.with_protocol_id("cybros_local")
	.with_chain_type(ChainType::Local)
	.with_properties(chain_properties())
	.with_genesis_config_preset_name(sp_genesis_builder::LOCAL_TESTNET_RUNTIME_PRESET)
	.build())
}

pub fn test_chain_spec() -> Result<Box<ChainSpec>, String> {
	Ok(Box::new(ChainSpec::from_json_bytes(include_bytes!("../chain_specs/test.json"))?))
}
