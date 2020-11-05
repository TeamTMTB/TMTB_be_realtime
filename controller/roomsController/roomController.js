
const redis = require("redis");
const connectInfo = require("../../redis-connect-info.json");
const client = redis.createClient({
    host : connectInfo.host, 
    port : connectInfo.port,
    password : connectInfo.password
});

// Redis에서 Room key 얻기
function getRoomsKeys(){
    return new Promise((resolve) => {
      client.keys("room:*", (err, rooms) => {
        resolve(rooms)
      })
    })
  }

// Redis에서 Room 전체 정보 얻기
async function getRoomsInfo(roomsKey){
    let roomsInfo = []
  
    for (const roomKey of roomsKey){
      let result = await new Promise((resolve) => {
        client.hgetall(roomKey , (err, reply) =>{
          resolve(reply);
        });
      });
      // console.log(result);
      roomsInfo.push(result);
      console.log(roomsInfo);
    }
  
    return roomsInfo;
  }

// Redis에서 특정 Room 정보 얻기
function getRoomInfo(roomKey){
    return new Promise((resolve) => {
        client.hgetall(roomKey,(err, roomInfo) => {
            resolve(roomInfo)
        })
    })
}

// Redis에서 Room 정보 저장하기
function storeRoom(userId, roomInfo){
    return new Promise((resolve) =>{
        client.hmset(`room:${userId}`, roomInfo, redis.print);
        resolve(true);
    })
}

function modifyRoom(userId, roomInfo){
    return new Promise((resolve) => {
        client.hmset(`room:${userId}`, roomInfo, redis.print);
        resolve(true);    
    })
}
// Redis에서 Room 정보 삭제하기
function deleteRoomInfo(roomId){
    return new Promise((resolve) => {
        console.log(roomId);
        client.del(`room:${roomId}`, redis.print);
        resolve(true);
    })
}


/*
  room 전체 리스트 조회
*/
let getRooms = async function(req, res){
    // res.send('서버 get 응답함!');
    let roomsInfo = []
    let roomsKey = await getRoomsKeys();
    console.log(roomsKey);
    roomsInfo = await getRoomsInfo(roomsKey);
    res.send(roomsInfo);
}

/*
    특정 room 정보 조회
*/
let getRoom = async function(req, res){
    let roomInfo = await getRoomInfo(`room:${req.params.roomId}`);
    res.send(roomInfo);
}

/*
    room 정보 저장
*/
let postRoom = async function(req, res){
    console.log(req.body.userId);
    let isOk = await storeRoom(req.body.userId, req.body.roomInfo);
    res.send(isOk);
}
/*
    room 정보 수정
*/
let putRoom = async function(req, res){
    let isOk = await modifyRoom(req.body.userId, req.body.roomInfo);
    res.send(isOk);
}
/*
    room 정보 삭제
*/
let deleteRoom = async function(req, res){
    let isOk = await deleteRoomInfo(req.params.roomId);
    res.send(isOk);
}

module.exports = {
    getRooms: getRooms,
    getRoom: getRoom,
    postRoom: postRoom,
    putRoom: putRoom,
    deleteRoom: deleteRoom
}