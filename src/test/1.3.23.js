const TestMetadata = require('../server/lib/test/TestMetadata.js');

class Test_1_3_23 extends TestMetadata {

    constructor(metadata) {
        super(metadata);
        this.num = "1.3.23";
        this.description = "The metadata CAN contain the claim request_object_encryption_alg_values_supported";
        this.validation = "self";
    }

    async exec() {
        super.exec();
        
        if(this.metadata.configuration.request_object_encryption_alg_values_supported==null
            || this.metadata.configuration.request_object_encryption_alg_values_supported=='') {

            // the encryption of request object is optional
            this.notes = "the claim request_object_encryption_alg_values_supported is not present";
            return true;

            //this.notes = this.metadata.configuration.request_object_encryption_alg_values_supported;
            //throw("the claim request_object_encryption_alg_values_supported is not present");
        } 

        this.notes = this.metadata.configuration.request_object_encryption_alg_values_supported;
        return true;

    }

}

module.exports = Test_1_3_23