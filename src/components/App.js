import React, { Component } from "react";
import Navbar from "./Navbar";
import Web3 from "web3";
import Tether from "../truffle_abis/Tether.json";
import RWD from "../truffle_abis/RWD.json";
import DecentralBank from "../truffle_abis/DecentralBank.json";
import Main from "./Main";
import ParticleSettings from "./ParticleSettings";

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("No ethereum browser detected");
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const account = await web3.eth.getAccounts();
    this.setState({ account: account[0] });
    const networkId = await web3.eth.net.getId();

    // Load tether Contract
    const tetherData = Tether.networks[networkId];
    if (tetherData) {
      const tether = new web3.eth.Contract(Tether.abi, tetherData.address);
      this.setState({ tether });
      let tetherBalance = await tether.methods
        .balanceOf(this.state.account)
        .call();
      this.setState({ tetherBalance: tetherBalance.toString() });
      //  console.log({ tetherBalance: tetherBalance });
    } else {
      window.alert("Error rather contract not deployed - no detected network!");
    }

    // load reward Contract
    const rwdData = RWD.networks[networkId];
    if (rwdData) {
      const rwd = new web3.eth.Contract(RWD.abi, rwdData.address);
      this.setState({ rwd });
      let rwdBalance = await rwd.methods.balanceOf(this.state.account).call();
      this.setState({ rwdBalance: rwdBalance.toString() });
      //  console.log({ rwdBalance: rwdBalance });
    } else {
      window.alert("Error rather contract not deployed - no detected network!");
    }

    // load Decentralbank Contract
    const decentralBankData = DecentralBank.networks[networkId];
    if (rwdData) {
      const decentralBank = new web3.eth.Contract(
        DecentralBank.abi,
        decentralBankData.address
      );
      this.setState({ decentralBank });
      let stakingBalance = await decentralBank.methods
        .stakingBalance(this.state.account)
        .call();
      this.setState({ stakingBalance: stakingBalance.toString() });
      //  console.log({ stakingBalance: stakingBalance });
    } else {
      window.alert("Error rather contract not deployed - no detected network!");
    }
    this.setState({ loading: false });
  }
  // two function one that stakes and one that un-stakes
  //leverage  our decentralBank contracts - deposit tokens and un-stakes
  //deposit Tokens transferFrom
  //All of this is for the staking
  // function approve transaction hash ----
  //STAKING FUNCTION ?? >> decentalBank.depositTokens(send transaction =>)

  stakeTokens = (amount) => {
    this.setState({ loading: true });
    this.state.tether.methods
      .approve(this.state.decentralBank._address, amount)
      .send({ from: this.state.account })
      .on("transitionHash", (hash) => {
        this.state.decentralBank.methods
          .depositTokens(amount)
          .send({ from: this.state.account })
          .on("transitionHash", (hash) => {
            this.setState({ loading: false });
          });
      });
  };

  unstakeTokens = () => {
    this.setState({ loading: true });
    this.state.decentralBank.methods
      .unstakeTokens()
      .send({ from: this.state.account })
      .on("transitionHash", (hash) => {
        this.setState({ loading: true });
      });
  };

  constructor(props) {
    super(props);
    this.state = {
      account: "0*0",
      tether: {},
      rwd: {},
      decentralBank: {},
      tetherBalance: "0",
      rwdBalance: "0",
      stakingBalance: "0",
      loading: true,
    };
  }

  render() {
    let content;
    {
      this.state.loading
        ? (content = (
            <p id="loader" className="text-center" style={{ margin: "30px" }}>
              LOADING PLEASE...
            </p>
          ))
        : (content = (
            <Main
              tetherBalance={this.state.tetherBalance}
              rwdBalance={this.state.rwdBalance}
              stakingBalance={this.state.stakingBalance}
              stakeTokens={this.stakeTokens}
              unstakeTokens={this.unstakeTokens}
            />
          ));
    }
    return (
      <div className="App" style={{ position: "relative" }}>
        <div style={{ position: "absolute" }}>
          <ParticleSettings />
        </div>

        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main
              role="main content"
              className="col-lg-12 ml-auto mr-auto"
              style={{ maxWidth: "600px", maxWeight: "100vm" }}
            >
              <div>{content}</div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
