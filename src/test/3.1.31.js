const TestTokenRequest = require("../server/lib/test/TestTokenRequest.js");

class Test_3_1_31 extends TestTokenRequest {
  constructor(metadata, authrequest, authresponse, tokenrequest) {
    super(metadata, authrequest, authresponse, tokenrequest);
    this.num = "3.1.31";
    this.description = "the redirect_uri is not present";
    this.validation = "self";
  }
  async exec() {
    this.tokenrequest.client_id = this.authrequest.client_id;
    this.tokenrequest.code = this.authresponse.code;
    this.tokenrequest.code_verifier = this.authrequest.code_verifier;
    this.tokenrequest.grant_type = "authorization_code";
    this.tokenrequest.client_assertion_type =
      "urn:ietf:params:oauth:client-assertion-type:jwt-bearer";

    const config_key = fs.readFileSync(
      path.resolve(__dirname, "../config/spid-oidc-check-op-sig.key")
    );
    const keystore = jose.JWK.createKeyStore();

    let key = await keystore.add(config_key, "pem");

    let header = {};

    let iat = moment();
    let exp = iat.clone().add(15, "m");

    let payload = JSON.stringify({
      jti: Utility.getUUID(),
      iss: this.tokenrequest.redirect_uri,
      aud: this.metadata.configuration.token_endpoint,
      iat: iat.unix(),
      exp: exp.unix(),
      sub:
        this.tokenrequest.redirect_uri === this.authrequest.redirect_uri
          ? this.tokenrequest.redirect_uri
          : null, //??? -> testare
    });

    this.tokenrequest.client_assertion = await jose.JWS.createSign(
      {
        format: "compact",
        alg: "RS256",
        fields: { ...header },
      },
      key
    )
      .update(payload)
      .final();
  }
}

module.exports = Test_3_1_31;
