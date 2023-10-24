var messagingService = require("../services/messagingService");

exports.messagingView = (req, res, next) => {
    const {title, body} = req.body;
    try {
        await messagingService.sendMessageToTopic(title, body);
        res.status(200).json({message: "Successfully sent message:"});
    } catch {
        res.status(500).json({error: "Failed to send message"});
    }
    res.render("messaging", {});
}

