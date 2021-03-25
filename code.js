let _Vue
class VueRouter {
	constructor({ mode, routes }) {
		let routerMap = {}
		routes.forEach(route => {
			let path = route.path;
			if(!routerMap[path]) {
				routerMap[path] = route;
			}
		})
		this.routerMap = routerMap;
		// TODO
		this.current = {
			path: '/',
			component: {
				template: '<div>默认模板</div>'
			}
		}
		this.listener();
	}

	listener() {
		window.addEventListener('load', ()=> {
			console.log("now is load");
			let hash = window.location.hash;
			if(!hash) {
				window.location.hash = '/'
			}
			this.matchByHash(hash);
		})
		window.addEventListener('hashchange', ()=> {
			console.log("now is hashchange");
			// log: #/foo
			let hash = window.location.hash;
			this.matchByHash(hash);
		})
	}

	search(path) {
		if(this.routerMap[path]) {
			return this.routerMap[path];
		}
		return null;
	}

	matchByHash(hash) {
		let route = this.search(hash.slice(1));
		if(!route) {
			throw new Error("There is no such route.");
		}
		this.current.path = route.path
		this.current.component = route.component
	}
}

VueRouter.install = function(Vue, options) {
	_Vue = Vue
	_Vue.mixin({
		beforeCreate() {
			let vm = this;
			if(vm.$options.router) {
				vm._routerRoot = this;
				vm._router = vm.$options.router;
				_Vue.util.defineReactive(vm, "_route", vm._router.current);
			} else {
				vm._routerRoot = vm.$parent && vm.$parent._routerRoot;  // 赋给子组件
			}
		}
	})

	_Vue.component('router-link', {
		props: {
			to: String
		},
		render(h) {
			return h('a', { attrs: { href: '#'+this.to } }, this.$slots.default)
		}
	})

	_Vue.component('router-view', {
		render(h) {
			let component = this._routerRoot._route.component
			return h(component)
		}
	})
}

if(typeof Vue !== 'undefined') {
	Vue.use(VueRouter)  // 手动注册vue-router
}