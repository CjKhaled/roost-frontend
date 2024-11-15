import { io, Socket } from 'socket.io-client'

const SOCKET_URL = 'http://localhost:3000'

class SocketService {
  private static instance: SocketService
  private socket: Socket | null = null

  private constructor () {}

  public static getInstance (): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService()
    }
    return SocketService.instance
  }

  public connect (): void {
    if (!this.socket) {
      this.socket = io(SOCKET_URL)
      this.registerDefaultHandlers()
    }
  }

  public disconnect (): void {
    this.socket?.disconnect()
    this.socket = null
  }

  public emit (event: string, data: any): void {
    this.socket?.emit(event, data)
  }

  public on (event: string, callback: (data: any) => void): void {
    this.socket?.on(event, callback)
  }

  public off (event: string): void {
    this.socket?.off(event)
  }

  private registerDefaultHandlers (): void {
    if (this.socket) {
      this.socket.on('disconnect', () => {
        console.log('Disconnected from server')
      })
    }
  }
}

export const socketService = SocketService.getInstance()
