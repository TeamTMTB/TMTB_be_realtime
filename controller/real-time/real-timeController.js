
let alarmCount = {};

let openRealTime = function (io) {

    /*
        
    */
    io.on("connection", (socket) => {
        console.log(socket.id + " 접속됨.");
        // socket.join(socket.id);
        // console.log(socket.rooms);
        socket.emit("your id", socket.id);
        
        socket.on("disconnect", () => {
            console.log(socket.id + " 접속종료.");
            
            delete alarmCount[socket.id]
            console.log("현재 알람 횟수 체크: ");
            console.log(alarmCount);
        })
        socket.on("test", ()=> {
            console.log("test!!!");
            console.log(socket.rooms);
            // console.log(io.sockets);
        })
        /*
            방입장 이벤트
        */
        socket.on("enter room", ({owner, userId}) => {
            socket.join(owner);
            alarmCount = {...alarmCount, [userId]:0};
            console.log(socket.id + "가 " + owner + " 방에 입장!");
            socket.to(owner).emit("enter event", socket.id);
            console.log("현재 알람 횟수 체크");
            console.log(alarmCount);

        })

        /*
            방나가기 이벤트
        */
       socket.on("leave room", ({owner}) => {
            socket.leave(owner);
            console.log(socket.id + "가 " + owner + "방에서 나감!");
            socket.to(owner).emit("leave event", socket.id);
       })
        /*
            타이머 시작 
        */
        socket.on("timer start sign", (owner) => {
            console.log("start sign 받음 !!");
            
            socket.to(owner).emit("timer start");
        })

        /*
            todo 완료 이벤트를 방 멤버들에게 보내기
        */
        socket.on("todo complete", (name, owner) => {
            socket.to(owner).emit("todo complete alert");
        })

        /*
            알람 끄는 이벤트
        */
        socket.on("alarm off", (name) => {

        })


    })
}


module.exports = openRealTime;