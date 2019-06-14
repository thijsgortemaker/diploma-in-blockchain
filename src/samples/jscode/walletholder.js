exports.walletholder= class walletholder{
    constructor(id,secret){
        this.walletConfig= {"id": id};
        this.walletCredentials= {"key": secret}
        this.walletHandle= undefined;
        this.seed = "{}";
        this.Did= undefined;
        this.Verkey =undefined;
    }
};