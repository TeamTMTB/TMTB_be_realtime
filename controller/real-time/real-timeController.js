

let openRealTime = function (io) {
    io.on("connection", (socket) => {
    console.log(socket.id + " 접속됨.");
    socket.to(socket.id).emit("your id", socket.id);

})
}


module.exports = openRealTime;