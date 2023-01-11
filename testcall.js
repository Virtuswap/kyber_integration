const axios = require('axios').default
const Web3 = require('web3')
const HDWalletProvider = require('@truffle/hdwallet-provider')

var provider = new HDWalletProvider('', `https://rpc.ankr.com/avalanche_fuji`)

const web3 = new Web3(provider)

function formatAPICall(
  tokenIn,
  tokenOut,
  amountIn,
  to,
  slippageTolerance,
  useMeta,
  saveGas,
) {
  let url = `https://aggregator-api.stg.kyberengineering.io/fuji/route/encode?tokenIn=${tokenIn}&tokenOut=${tokenOut}&amountIn=${amountIn}&to=${to}&slippageTolerance=${slippageTolerance}&useMeta=${useMeta}&saveGas=${saveGas}`
  return url
}

async function run() {
  let apiURI = formatAPICall(
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    '0xbde248b108065a08c60c88d9ed09aec5a8d9a2b1',
    '50000000000000',
    '0x17ae363f142517b593d9a71282bab8ca6bb4ea51',
    '2000',
    'false',
    '1',
  )

  let apiRes = await axios.get(apiURI)

  let accounts = await web3.eth.getAccounts()
  let web3Res = await web3.eth.sendTransaction({
    from: accounts[0],
    to: apiRes.data.routerAddress,
    data: apiRes.data.encodedSwapData,
    value: apiRes.data.inputAmount,
  })

  console.log(`swap tx: ${web3Res.transactionHash}`)
}

run().then(() => {})
