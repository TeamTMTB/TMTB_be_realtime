
let userCount = {};
let userList = {};
let alarmCount = {};

let count =1;
//owner = 방장
//userId = 개인 id (socket id)

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
            //alarmCount = {...alarmCount, [userId]:0};
            console.log(userId + "가 " + owner + " 방에 입장!");
            io.to(owner).emit("enter event", owner, userId);
            io.to(owner).emit("room member entered", owner, userId);
            //방 멤버 이름 보내주기
            //io.to(owner).emit("방 멤버", userId);
        })

        /*
            방 멤버 이름 보내주기
        */
        socket.on("send user", (owner, userName)=>{
            //방 멤버 이름 보내주기
            console.log(userName + "---- " + owner + "----");
            io.to(owner).emit("방 멤버", userName);
            //io.to(owner).emit("방 멤버", {userName});
        })

        /*
            방나가기 이벤트
        */
       socket.on("leave room", ({owner}) => {
            socket.leave(owner);
            console.log(socket.id + "가 " + owner + "방에서 나감!");
            console.log(alarmCount);
            socket.to(owner).emit("leave event", socket.id);
       })

       /*
            텀이 끝났을때 방 삭제
        */
       socket.on("term is over", (owner, userName, term, maxTerm)=> {
            console.log(owner + " " + userName + " "+ term+" "+maxTerm);
            socket.emit("remove room", owner);
            socket.emit("room over, show study king", owner);
        })

        /*
            타이머 시작 
        */
        socket.emit("your id", socket.id); //클라이언트에 보낼 데이터
        
        socket.on("timer start sign", (owner, message) => {
            console.log("okay!!!");
            console.log(message);
            io.to(owner).emit("timer start", "timer start 명령 받음");
            io.to(owner).emit("start", true);
            console.log("okay!!");
        });

        /*
            todo 완료 이벤트를 방 멤버들에게 보내기
        */
        socket.on("todo complete", (name, owner) => {
            socket.to(owner).emit("todo complete alert");
        })

        /*
            알람 끄는 이벤트
        */
        socket.on("alarm off", (owner, userId, count, term) => {
            console.log("alarm off");
            alarmCount = {...alarmCount, [userId]:count};
            //멤버별 알람 끈 갯수 세기
            io.to(owner).emit("show user name", userId, count);
            console.log(alarmCount);

        })

        /*
            Todo 유저별 체크
        */
       socket.on("todo checked", ({todoDesc, userName, owner})=>{
        console.log(todoDesc+ " "+owner+" "+userName);
        io.to(owner).emit("show todo checked", todoDesc, userName);
    });

        /*
            스터디 킹 유저 뿌려주기
        */
       socket.emit("study king", (userId) => {
        console.log(userId);
    })


    })
}


module.exports = openRealTime;