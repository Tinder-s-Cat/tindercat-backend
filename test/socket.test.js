const request = require('supertest')

const io = require('socket.io-client')
const server = require('../socketConfig')

const { generateToken } = require('../helpers/jwt')
const { User, ChatRoom, IsMatch } = require('../models')
const clearUser = require('./helper/clearUser')

let user_id

let user2_id
let chatRoomId
let isMatchId

beforeAll(function (done) {
	User.create({
		email: 'test@mail.com',
		username: 'test',
		password: 'password',
		location: 'jakarta selatan',
		profilePicture:
			'https://i.natgeofe.com/n/f0dccaca-174b-48a5-b944-9bcddf913645/01-cat-questions-nationalgeographic_1228126.jpg',
	})
		.then((data) => {
			return User.findOne({
				where: {
					email: data.email,
				},
			})
		})
		.then((data) => {
			let payload = {
				id: data.id,
				email: data.email,
			}

			user_id = data.id
			return User.create({
				email: 'test2@mail.com',
				username: 'test2',
				password: 'password',
				location: 'jakarta barat',
				profilePicture:
					'https://i.natgeofe.com/n/f0dccaca-174b-48a5-b944-9bcddf913645/01-cat-questions-nationalgeographic_1228126.jpg',
			})
		})
		.then((data) => {
			return User.findOne({
				where: {
					email: data.email,
				},
			})
		})
		.then((data) => {
			let payload = {
				id: data.id,
				email: data.email,
			}

			user2_id = data.id

			return IsMatch.create({
				UserId: user_id,
				OwnerId: user2_id,
				status: 'match',
			})
			// done()
		})
		.then((data) => {
			return IsMatch.findOne({ where: { id: data.id } })
		})
		.then((data) => {
			isMatchId = data.id
			return ChatRoom.create({
				IsMatchId: data.id,
			})
		})
		.then((data) => {
			chatRoomId = data.id
			done()
		})
		.catch((err) => {
			done(err)
		})
})

afterAll(function (done) {
	clearUser()
		.then(function () {
			done()
		})
		.catch((err) => {
			done(err)
		})
})

describe('Suite of unit tests', function () {
	//ngejalain servernya
	server.attach(3010)
	// let sender;
	// let receiver;

	let socket

	beforeEach(function (done) {
		// Setup
		socket = io.connect('http://localhost:3010', {
			'reconnection delay': 0,
			'reopen delay': 0,
			'force new connection': true,
		})

		socket.on('connect', function () {
			console.log('worked...')
			done()
		})
		socket.on('disconnect', function () {
			console.log('disconnected...')
		})
	})

	afterEach(function (done) {
		// Cleanup
		if (socket.connected) {
			console.log('disconnecting...')
			socket.disconnect()
		} else {
			// There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
			console.log('no connection to break...')
		}
		done()
	})
	afterAll(function (done) {
		server.close()
		done()
	})

	describe('Chat tests', function () {
		test('Sending message to the chat', (done) => {
			let chatMessage = {
				UserId: user_id,
				ChatRoomId: chatRoomId,
				message: 'message',
			}
			socket.emit('join-room', chatRoomId)
			socket.emit('send-message', chatMessage)

			socket.on('receive-message', (dataRes) => {
				expect(dataRes).toBeInstanceOf(Object)
				expect(dataRes).toHaveProperty('id')
				expect(dataRes).toHaveProperty('UserId')
				expect(dataRes).toHaveProperty('ChatRoomId')
				done()
			})
		})
	})
	describe('Chat tests error', function () {
		test('Sending message to the chat error', (done) => {
			let chatMessage = {
				UserId: 'user_id',
				ChatRoomId: chatRoomId,
				message: 'message',
			}
			socket.emit('join-room', chatRoomId)
			socket.emit('send-message', chatMessage)

			socket.on('receive-message-fail', (dataRes) => {
				expect(dataRes).toBeInstanceOf(Object)
				expect(dataRes).toHaveProperty('error')
				done()
			})
		})
	})

	describe('Refetch Data', function () {
		test('Sending message to the chat error', (done) => {
			socket.emit('refetch-match', '')

			socket.on('refetch-receive', (dataRes) => {
				expect(dataRes).toBeInstanceOf(Object)
				expect(dataRes).toHaveProperty('action')
				done()
			})
		})
	})
})
