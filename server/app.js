const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const users= require('./users')()

const mes = (name, text, id) => ({name, text, id})

io.on('connection', socket => {
	socket.on('userJoined', (data, callback) => {
		if (!data.name || !data.room) {
			return callback('Wrong data')
		}

		socket.join(data.room)

		users.remove(socket.id)
		users.add({
			id: socket.id,
			name: data.name,
			room: data.room
		})

		callback({userId: socket.id})
		io.to(data.room).emit('updateUsers', users.getByRoom(data.room))
		socket.emit('newMessage', mes('admin', `Добро пожаловать ${data.name}`))
		socket.broadcast
			.to(data.room)
			.emit('newMessage', mes('admin', `Пользователь ${data.name} зашёл`))
	})

	socket.on('createMessage', (data, callback) => {
		if (!data.text) {
			return callback('Текст не может быть пустым')
		}

		const user = users.get(data.id)
		if (user) {
			io.to(user.room).emit('newMessage', mes(user.name, data.text, data.id))
		}

		callback()
	})

	socket.on('userLeft', (id, callback) => {
		const user = users.remove(id)
		if (user) {
			io.to(user.room).emit('updateUsers', users.getByRoom(user.room))
			io.to(user.room).emit('newMessage', mes('admin', `Пользователь ${user.name} вышел`))
		}
		callback()
	})

	socket.on('disconnect', () => {
		const user = users.remove(socket.id)
		if (user) {
			io.to(user.room).emit('updateUsers', users.getByRoom(user.room))
			io.to(user.room).emit('newMessage', mes('admin', `Пользователь ${user.name} вышел`))
		}
	})
})

module.exports = {
	app, server
}
