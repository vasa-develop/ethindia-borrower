import contract from './contract'
import TourusENS from '../TorusENS'
var Web3 = require('web3');

var web3 = new Web3(new Web3.providers.WebsocketProvider('wss://kovan.infura.io/ws/v3/b94d9fecfb0f4d5697929ee98607c9f5'));

const keystore = {
    address: "0x232D1038Ca6d21DF85F2109E6155E3f7c0Eea808",
    privateKey: "DD3853D79745BD65A3A2691052E9FE27C39A314E45780B389E5CEB236D615F6C"
}

const erc20Contract = new web3.eth.Contract(contract.abi, contract.address, {
    from: keystore.address,
    gas: 3000000,
})

const sendERC20 = (to, amount) => {
    console.log(amount)
    new Promise((resolve, reject) => {
        let data = erc20Contract.methods.transfer(to, amount).encodeABI()

        const Tx = require('ethereumjs-tx')
        const privateKey = new Buffer.from(keystore.privateKey, 'hex')

        web3.eth.getTransactionCount(keystore.address)
            .then(nonce => {

                const rawTx = {
                    nonce: nonce,
                    gasPrice: 9000000000,
                    gasLimit: 3000000,
                    to: contract.address,
                    data: data
                }

                const tx = new Tx(rawTx);
                tx.sign(privateKey);

                const serializedTx = tx.serialize()

                web3.eth.sendSignedTransaction('0x' +
                    serializedTx.toString('hex'))
                    .on('transactionHash', function (hash) {
                        console.log(`hash: ${hash}`)
                        return resolve(hash)
                    })
                    .on('receipt', function (receipt) {
                        console.log(`receipt:`)
                        console.dir(receipt)
                    })
                    .on('confirmation', function (confirmationNumber, receipt) {
                        console.log(`confirmationNumber: ${confirmationNumber}, receipt: ${receipt} `)
                    })
                    .on('error', function (error) {
                        console.error(error)
                        return reject(error)
                    })
            })
            .catch(error => {
                return reject(error)
            })
    })

}


const balanceOf = address => {

    return new Promise((resolve, reject) => {
        let data = erc20Contract.methods.balanceOf(address).encodeABI()

        web3.eth.call({
            from: keystore.address,
            to: contract.address,
            data: data
        })
            .then(receipt => {
                if (receipt != 42) {
                    console.log(receipt)
                    console.log("receipe", parseInt(receipt, 16))
                    return resolve(parseInt(receipt, 16).toString())
                }
                return resolve("0x")
            })
            .catch((error) => {
                console.log("receipeerror", error)
                return reject(error)
            })
    })
}

export default {
    balanceOf,
    sendERC20,
    TourENS: new TourusENS(web3)
}