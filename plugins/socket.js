import Vue from 'vue'
// import io from 'socket.io-client'
// import VueSocketIO from 'vue-socket.io-extended'
import VueSocketIO from "vue-socket.io"

// export default ({ store }) => {
// 	Vue.use(VueSocketIO, io('http://localhost:3000/'),
// 		{
// 			store,
// 			debug: false,
// 			actionPrefix: 'SOCKET_',
// 			mutationPrefix: 'SOCKET_'
// 		})
// }

export default function ({ store }) {
	Vue.use(new VueSocketIO({
		debug: false,
		connection: 'https://nuxt-express-chat.herokuapp.com/',
		vuex: {
			store,
			actionPrefix: 'SOCKET_',
			mutationPrefix: 'SOCKET_'
		}
	}))
}


