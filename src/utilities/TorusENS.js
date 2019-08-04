/* var Web3 = require('web3');
var provider = new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws/v3/b94d9fecfb0f4d5697929ee98607c9f5'); */
const ENS = require('ethereum-ens');


export default class TorusENS {

    constructor(provider) {
        this.provider = provider;
        this.ens = new ENS(provider);
    }

    async signIn(ensName) {

        //check if ensName is registered or not 
        var addr = await this.ensResolve(ensName)

        let accounts = await window.ethereum.enable()
        let trx = await this.register(ensName, accounts[0])
        return {
            accounts,
            trx,
            ensName
        }
    }


    async reverseResolve(address) {
        var name = await this.ens.reverse(address).name()

        // Check to be sure the reverse record is correct.
        if (address != await this.ens.resolver(name).addr()) {
            return null
        }
        return name
    }

    async ensResolve(ensName) {
        return new Promise((resolver, reject) => {
            this.ens.resolver(ensName).addr()
                .then(function (addr) {
                    resolver(addr)
                })
                .catch(err => {
                    console.log("Test 0001: ", err)
                    reject(err)
                })
        })

    }

    async register(name, addr, params) {
        return this.ens.setOwner(name, addr, params)
    }

}
