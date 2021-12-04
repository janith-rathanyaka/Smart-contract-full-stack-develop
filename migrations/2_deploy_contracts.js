
const Tether = artifacts.require('Tether')
const RWD = artifacts.require('RWD')
const DecentralBank = artifacts.require('DecentralBank')

module.exports = async function(deployer) {
    
    // Deploy Mock Tether contact
    await deployer.deploy(Tether)

    // Deploy RWD Contract 
    await deployer.deploy(RWD)

    // Deploy DecentralBank Contact
    await deployer.deploy(DecentralBank)

}
