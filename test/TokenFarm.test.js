const { assert } = require("chai");
const { FormControlStatic } = require("react-bootstrap");
const { default: Web3 } = require("web3");

const DaiToken = artifacts.require("DaiToken");
const DappToken = artifacts.require("DappToken");
const TokenFarm = artifacts.require("TokenFarm");

require("chai")
	.use(require("chai-as-promised"))
	.should();

function tokens(n) {
	return web3.utils.toWei(n, "Ether");
}

contract("TokenFarm", ([owner, investor]) => {
	let daiToken, dappToken, tokenFarm;

	before(async () => {
		// Load Contracts
		daiToken = await DaiToken.new();
		dappToken = await DappToken.new();
		tokenFarm = await TokenFarm.new(daiToken.address, dappToken.address);

		// Transfer all Dapp tokens to farm (1 mil)
		await dappToken.transfer(tokenFarm.address, tokens("1000000"));

		// Send tokens to investor
		await daiToken.transfer(investor, tokens("100"), {
			from: owner,
		});
	});

	describe("Mock Dai deployment", async () => {
		it("has a name", async () => {
			const name = await daiToken.name();
			assert.equal(name, "Mock DAI Token");
		});
	});

	describe("Dapp Token deployment", async () => {
		it("has a name", async () => {
			const name = await dappToken.name();
			assert.equal(name, "DApp Token");
		});
	});
});
