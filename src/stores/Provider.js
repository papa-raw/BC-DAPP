import { observable, action } from 'mobx'
import Web3 from 'web3';
import store from './Root'
import * as moment from 'moment';


const schema = {
    BondedToken: require('../abi/BondedToken'),
    BondingCurve: require('../abi/BondingCurve'),
    RewardsDistributor: require('../abi/RewardsDistributor'),
    CollateralToken: require('../abi/ERC20'),
    StaticCurveLogic: require('../abi/StaticCurveLogic'),
}

const objects = {}

class ProviderStore {
    @observable web3 = new Web3('https://kovan.infura.io/v3/aab5c86e538b43509008efff47d61162')
    @observable context;
    @observable defaultAccount = '';
    @observable isProviderSet = false;
    @observable isAccountSet = false;
    // @observable state: ProviderState = ProviderState.LOADING

    // TODO reconcile these provider values with those above
    @observable address = ''
    @observable isConnected = false
    @observable chainId = ''
    @observable ETHBalance = 0

    loadObject = (type, address, label) => {
    	// TODO what to do about web3
        // TODO what function to use for the from field below?
        const object = new this.web3.eth.Contract(schema[type].abi, address, { from: this.getSelectedAddress() });
        if (label) {
            objects[label] = object;
        }
        return object;
    }

    // get blockTime from blockNumber
    async getBlockTime(blockNumber) {
        const blockData = await this.web3.eth.getBlock(blockNumber)
        const date = new Date(blockData.timestamp*1000)
        return moment(date).format('DD.MM - HH:mm');
    }

    // get blockHash from blockNumber
    async getBlockHash(blockNumber) {
        const blockData = await this.web3.eth.getBlock(blockNumber)
        return blockData.hash
    }

    getSelectedAddress = () => {
        // return this.web3.eth.defaultAccount as string;
        return this.web3.eth.accounts.givenProvider.selectedAddress;
    }

    // Get ETH balance for account
    setETHBalance = async () => {
        const balance = await this.web3.eth.getBalance(this.address)
        this.ETHBalance = balance
    }

    // Check for confirmation
    // confirmationFlag Indicates what the confirmation check is for
    checkConfirmation = (txHash, confirmationFlag) => {
        console.log("checking whether transaction was confirmed with any confirmations")
        const self = this
        this.web3.eth.getTransaction(txHash).then(
            function(result) {
                console.log(result)
                if (result.blockHash == null) {
                    console.log("transaction not mined yet")
                    console.log("blockhash: " + result.blockHash)
                    console.log("tx hash: " + txHash)
                    return setTimeout( self.checkConfirmation(txHash, confirmationFlag), 0.1*1000)
                } else {
                    console.log("transaction confirmed!")
                    store.tradingStore.setDappTradeData()
                    return store.tradingStore.setStateConfirmed(confirmationFlag)
                }
            }
        )
    }
}

export default ProviderStore
