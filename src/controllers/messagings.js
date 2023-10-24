const messagingView = (req, res) => {
    res.render("messaging", {
        pageTitle: "Messaging",
        path: ""
    });
}

module.exports = {messagingView};
