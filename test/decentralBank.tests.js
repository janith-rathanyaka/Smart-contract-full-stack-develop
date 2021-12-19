const Tether = artifacts.require("Tether");
const RWD = artifacts.require("RWD");
const DecentralBank = artifacts.require("DecentralBank");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("DecentralBank", ([owner, customer]) => {
  let tether, rwd, decentralBank;

  function tokens(number) {
    return web3.utils.toWei(number, "ether");
  }

  before(async () => {
    // Load Contracts
    tether = await Tether.new();
    rwd = await RWD.new();
    decentralBank = await DecentralBank.new(rwd.address, tether.address);

    // Transfer all tokens to DecentralBank (1 million)
    await rwd.transfer(decentralBank.address, tokens("1000000"));

    // Transfer 100 mock Tethers to Customer
    await tether.transfer(customer, tokens("100"), { from: owner });
  });

  describe("Mock Tether Deployment", async () => {
    it("matches name successfully", async () => {
      const name = await tether.name();
      assert.equal(name, "Mock Tether Token", "Successfully");
    });
  });

  describe("Reward Token", async () => {
    it("matches name successfully", async () => {
      const name = await rwd.name();
      assert.equal(name, "Reward Token");
    });
  });

  describe("Decentral Bank Deployment", async () => {
    it("matches name successfully", async () => {
      const name = await decentralBank.name();
      assert.equal(name, "Decentral Bank");
    });

    it("contract has tokens", async () => {
      let balance = await rwd.balanceOf(decentralBank.address);
      assert.equal(balance, tokens("1000000"));
    });

    describe("Yield Farming", async () => {
      it("rewards tokens for staking", async () => {
        let result;

        // Check Investor Balance
        result = await tether.balanceOf(customer);
        assert.equal(
          result.toString(),
          tokens("100"),
          "customer mock wallet balance "
        );

        // Check staking For Customer
        await tether.approve(decentralBank.address, tokens("100"), {
          from: customer,
        });
        await decentralBank.depositTokens(tokens("100"), { from: customer });

        // Check update Balance of customer
        result = await tether.balanceOf(customer);
        assert.equal(
          result.toString(),
          tokens("0"),
          "customer mock wallet balance after staking"
        );

        // CHeck Updated Balance of Decennial Bank

        result = await tether.balanceOf(decentralBank.address);
        assert.equal(
          result.toString(),
          tokens("100"),
          "decentralBank mock wallet balance after staking from customer"
        );

        // Is Staking Balance
        result = await decentralBank.isStaking(customer);
        assert.equal(
          result.toString(),
          "true",
          "Customer is staking status after staking "
        );

        // Issue Tokens
        await decentralBank.issueTokens({ from: owner });

        // Ensure Only the owner
        await decentralBank.issueTokens({ from: customer }).should.be.rejected;

        // Unstake Tokens
    //    await decentralBank.unstakeTokens({from: customer})

        // check unstake balance
    //    await decentralBank.unstakeTokens({from: customer})
      });
    });
  });
});
