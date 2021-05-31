const io = require('socket.io')()
const { Message, User } = require('./models')

io.on('connection', (socket) => {
	socket.on('join-room', (data) => {
		socket.join(data)
	})

	socket.on('send-message', (payload) => {
		let chatMessage = {
			UserId: payload.UserId,
			ChatRoomId: payload.ChatRoomId,
			message: payload.message,
		}
		Message.create(chatMessage, {
			include: [
				{
					model: User,
					attributes: ['profilePicture', 'id', 'username', 'location'],
				},
			],
			returning: true,
			plain: true,
		})
			.then((data) => {
				io.to(payload.ChatRoomId).emit('receive-message', data)
			})
			.catch((err) => {
				io.to(payload.ChatRoomId).emit('receive-message-fail', {
					error: 'error',
				})
			})
	})
})

module.exports = io
