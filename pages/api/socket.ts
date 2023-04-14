import { Server } from 'socket.io';
import { NextApiRequest } from 'next';
import { NextApiResponseWithSocket } from '@/types/socket';
import { ServerToClientEvents,ClientToServerEvents } from "@/types/socket";

const ioHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io');

    const io = new Server<ClientToServerEvents,ServerToClientEvents>(res.socket.server);

    io.on('connection', (socket) => {
      socket.broadcast.emit('userServerConnection');
      socket.on('hello', (msg) => {
        socket.emit('hello', msg);
      });
        socket.on('disconnect', () => {
        console.log('A user disconnected');
        socket.broadcast.emit("userServerDisconnection",socket.id)
      });
    });
    
   
    res.socket.server.io = io;
  } else {
    console.log('socket.io already running');
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;

