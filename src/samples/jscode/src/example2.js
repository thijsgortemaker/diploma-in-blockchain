/*
 * Example demonstrating how to do the key rotation on the ledger.
 *
 * Steward already exists on the ledger and its DID/Verkey are obtained using seed.
 * Trust Anchor's DID/Verkey pair is generated and stored into wallet.
 * Stewards builds NYM request in order to add Trust Anchor to the ledger.
 * Once NYM transaction is done, Trust Anchor wants to change its Verkey.
 * First, temporary key is created in the wallet.
 * Second, Trust Anchor builds NYM request to replace the Verkey on the ledger.
 * Third, when NYM transaction succeeds, Trust Anchor makes new Verkey permanent in wallet
 * (it was only temporary before).
 *
 * To assert the changes, Trust Anchor reads both the Verkey from the wallet and the Verkey from the ledger
 * using GET_NYM request, to make sure they are equal to the new Verkey, not the original one
 * added by Steward
 */

const indy = require('indy-sdk')
const util = require('./util')
const colors = require('./colors')

const log = console.log

function logValue() {
    log(colors.CYAN, ...arguments, colors.NONE)
}

async function run() {

    log("Set protocol version 2 to work with Indy Node 1.4")
    await indy.setProtocolVersion(2)

    // Step 2 code goes here.
    // Tell SDK which pool you are going to use. You should have already started
    // this pool using docker compose or similar. Here, we are dumping the config
    // just for demonstration purposes.

    // 1.
    log('1. Creates a new local pool ledger configuration that is used later when connecting to ledger.')
    const poolName = 'pool'
    const genesisFilePath = await util.getPoolGenesisTxnPath(poolName)
    const poolConfig = {'genesis_txn': genesisFilePath}
    await indy.createPoolLedgerConfig(poolName, poolConfig)

    // 2.
    log('2. Open pool ledger and get handle from libindy')
    const poolHandle = await indy.openPoolLedger(poolName, undefined)

    // 3.
    log('3. Creating new secure wallet with the given unique name')
    const walletConfig = {"id": "wallet"}
    const walletCredentials = {"key": "wallet_key"}
    await indy.createWallet(walletConfig, walletCredentials)

    // 4.
    log('4. Open wallet and get handle from libindy to use in methods that require wallet access')
    const walletHandle = await indy.openWallet(walletConfig, walletCredentials)

    // First, put a steward DID and its keypair in the wallet. This doesn't write anything to the ledger,
    // but it gives us a key that we can use to sign a ledger transaction that we're going to submit later.

    // The DID and public verkey for this steward key are already in the ledger; they were part of the genesis
    // transactions we told the SDK to start with in the previous step. But we have to also put the DID, verkey,
    // and private signing key into our wallet, so we can use the signing key to submit an acceptably signed
    // transaction to the ledger, creating our *next* DID (which is truly new). This is why we use a hard-coded seed
    // when creating this DID--it guarantees that the same DID and key material are created that the genesis txns
    // expect.

    // 5.
    log('5. Generating and storing steward DID and verkey')
    const stewardSeed = '000000000000000000000000Steward1'
    const did = {'seed': stewardSeed}
    const [stewardDid, stewardVerkey] = await indy.createAndStoreMyDid(walletHandle, did)
    logValue('Steward DID: ', stewardDid)
    logValue('Steward Verkey: ', stewardVerkey)

    // Now, create a new DID and verkey for a trust anchor, and store it in our wallet as well. Don't use a seed;
    // this DID and its keys are secure and random. Again, we're not writing to the ledger yet.

    // 6.
    log('6. Generating and storing trust anchor DID and verkey')
    const [trustAnchorDid, trustAnchorVerkey] = await indy.createAndStoreMyDid(walletHandle, "{}")
    logValue('Trust Anchor DID: ', trustAnchorDid)
    logValue('Trust Anchor Verkey: ', trustAnchorVerkey)

    // Here, we are building the transaction payload that we'll send to write the Trust Anchor identity to the ledger.
    // We submit this transaction under the authority of the steward DID that the ledger already recognizes.
    // This call will look up the private key of the steward DID in our wallet, and use it to sign the transaction.

    // 7.
    log('7. Building NYM request to add Trust Anchor to the ledger')
    const nymRequest = await indy.buildNymRequest(/*submitter_did*/ stewardDid,
        /*target_did*/ trustAnchorDid,
        /*ver_key*/ trustAnchorVerkey,
        /*alias*/ undefined,
        /*role*/ 'TRUST_ANCHOR')

    // Now that we have the transaction ready, send it. The building and the sending are separate steps because some
    // clients may want to prepare transactions in one piece of code (e.g., that has access to privileged backend systems),
    // and communicate with the ledger in a different piece of code (e.g., that lives outside the safe internal
    // network).

    // 8.
    log('8. Sending NYM request to the ledger')
    await indy.signAndSubmitRequest(/*pool_handle*/ poolHandle,
        /*wallet_handle*/ walletHandle,
        /*submitter_did*/ stewardDid,
        /*request_json*/ nymRequest)

    // At this point, we have successfully written a new identity to the ledger. Our next step will be to query it.

    // Step 3 code goes here.
     // 9.
     log('9. Generating new verkey of trust anchor in wallet')
     const newVerkey = await indy.replaceKeysStart(walletHandle, trustAnchorDid, "{}")
     logValue('New Trust Anchor Verkey: ', newVerkey)
 
     // 10.
     log('10. Building NYM request to update new verkey to ledger')
     const nymRequestForNewVerkey = await indy.buildNymRequest(trustAnchorDid, trustAnchorDid, newVerkey, undefined, 'TRUST_ANCHOR')
 
     // 11.
     log('11. Sending NYM request to the ledger')
     await indy.signAndSubmitRequest(poolHandle, walletHandle, trustAnchorDid, nymRequestForNewVerkey)
 
     // 12.
     log('12. Apply new verkey in wallet')
     await indy.replaceKeysApply(walletHandle, trustAnchorDid) 

    // Step 4 code goes here.
    // 13.
    log('13. Reading new verkey from wallet')
    const trustAnchorVerkeyInWallet = await indy.keyForLocalDid(walletHandle, trustAnchorDid)
    logValue('Trust Anchor Verkey in wallet: ', trustAnchorVerkeyInWallet)

    // 14.
    log('14. Building GET_NYM request to get Trust Anchor verkey')
    const getNymRequest = await indy.buildGetNymRequest(trustAnchorDid, trustAnchorDid)

    // 15.
    log('15. Sending GET_NYM request to ledger')
    const getNymResponse = await indy.submitRequest(poolHandle, getNymRequest)

    // 16.
    log('16. Comparing Trust Anchor verkeys: written by Steward (original), current in wallet and current from ledger')
    logValue('Written by Steward: ', trustAnchorVerkey)
    logValue('Trust Anchor Verkey in wallet: ', trustAnchorVerkeyInWallet)
    const trustAnchorVerkeyFromLedger = JSON.parse(getNymResponse['result']['data'])['verkey']
    logValue('Trust Anchor Verkey from ledger: ', trustAnchorVerkeyFromLedger)
    logValue('Matching: ', trustAnchorVerkeyFromLedger == trustAnchorVerkeyInWallet != trustAnchorVerkey)

    // Do some cleanup.

    // 17.
    log('17. Closing wallet and pool')
    await indy.closeWallet(walletHandle)
    await indy.closePoolLedger(poolHandle)

    // 18.
    log('18. Deleting created wallet')
    await indy.deleteWallet(walletConfig, walletCredentials)

    // 19.
    log('19. Deleting pool ledger config')
    await indy.deletePoolLedgerConfig(poolName)

}

try {
    run()
} catch (e) {
    log("ERROR occured : e")
}