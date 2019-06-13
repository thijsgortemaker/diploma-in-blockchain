const router = require('express').Router();

router.get("/", function(req, rsp){
    console.log("Test is working");
    rsp.end("Test is working. Connected with Cloud Agent server");
})

module.exports = router;