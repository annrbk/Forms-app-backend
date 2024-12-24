const WebSocket = require("ws");
const Comment = require("../models/comment");
const User = require("../models/user");

const wsComment = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", function connection(ws) {
    console.log("Client connected");

    ws.on("message", async function (message) {
      try {
        const receivedMessage = JSON.parse(message);
        if (receivedMessage.action === "add") {
          const { templateId, text, author, date } = receivedMessage;

          const user = await User.findById(author);

          const newComment = new Comment({
            templateId,
            author: user._id,
            text,
            date: new Date(),
          });

          await newComment.save();

          const response = {
            action: "add",
            templateId: newComment.templateId,
            author: {
              _id: newComment.author,
              email: user.email,
            },
            text: newComment.text,
            date: newComment.date,
          };

          wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(response));
            }
          });
        } else if (receivedMessage.action === "delete") {
          const { commentId } = receivedMessage;

          await Comment.findByIdAndDelete(commentId);
          console.log("Comment deleted");

          const response = {
            action: "delete",
            commentId,
          };

          wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(response));
            }
          });
        }
      } catch (error) {
        console.error("WebSocket Error", error);
      }
    });

    ws.on("close", function () {
      console.log("Client disconnected");
    });
    ws.onerror = function (error) {
      console.error(error);
    };
  });
};

module.exports = wsComment;
