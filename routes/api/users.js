router.post('/auth', function (req, res) {

    // TODO: Install bcrypt
    // TODO: Add database functionality
    // TODO: Add real JWT
    let username = req.body.username;
    let password = req.body.username;

    // doorzoek database op username match 
    let foundUsn;
    let foundHash;

    // decrypt found password
    if (false) {
        res.status(403);
        res.json({ "response": "unsuccessfull" });
        return;
    }
    res.status(200).json({ "token": "token" });
})

module.exports = router;