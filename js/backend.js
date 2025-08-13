// 后端适配器：优先使用 LeanCloud，未配置则回退 LocalStorage

class BackendAdapter {
	constructor(config) {
		this.config = config;
		this.provider = this.resolveProvider();
	}

	resolveProvider() {
		const mode = (this.config.storage && this.config.storage.provider) || 'auto';
		const lc = this.config.leancloud || {};
		const lcReady = lc.appId && lc.appKey && lc.serverURL;
		if (mode === 'leancloud') return lcReady ? 'leancloud' : 'local';
		if (mode === 'local') return 'local';
		return lcReady ? 'leancloud' : 'local';
	}

	// 初始化（仅云端需要）
	async init() {
		if (this.provider === 'leancloud') {
			AV.init({ appId: this.config.leancloud.appId, appKey: this.config.leancloud.appKey, serverURL: this.config.leancloud.serverURL });
		}
	}

	// ========== 用户 ==========
	async login(username, password) {
		if (this.provider === 'leancloud') {
			const user = await AV.User.logIn(username, password);
			return {
				id: user.id,
				username: user.getUsername(),
				nickname: user.get('nickname') || user.getUsername(),
				avatar: user.get('avatar') || 'img/icon.jpg'
			};
		}
		// local: 在 localStorage 的 users 中查找
		const users = JSON.parse(localStorage.getItem('users') || '[]');
		const u = users.find(x => x.username === username && x.password === password);
		if (!u) throw new Error('Invalid credentials');
		return u;
	}

	logout() {
		if (this.provider === 'leancloud') {
			return AV.User.logOut();
		}
		localStorage.removeItem('currentUser');
	}

	// ========== 帖子 ==========
	async createPost({ content, media, authorId }) {
		if (this.provider === 'leancloud') {
			const Post = AV.Object.extend('Post');
			const post = new Post();
			post.set('content', content);
			// 关联作者（使用当前登录用户）
			const current = AV.User.current();
			post.set('author', current || AV.Object.createWithoutData('_User', authorId));
			post.set('media', media);
			post.set('likes', 0);
			// 仅创建者可写，公众可读
			const acl = new AV.ACL();
			acl.setPublicReadAccess(true);
			if (current) acl.setWriteAccess(current, true);
			post.setACL(acl);
			await post.save();
			return { id: post.id, content, media, likes: 0, userId: authorId, createdAt: post.createdAt };
		}
		// local
		const p = { id: Date.now(), content, media, likes: 0, userId: authorId, createdAt: Date.now() };
		const posts = JSON.parse(localStorage.getItem('posts') || '[]');
		posts.unshift(p);
		localStorage.setItem('posts', JSON.stringify(posts));
		return p;
	}

	async listPosts() {
		if (this.provider === 'leancloud') {
			const query = new AV.Query('Post');
			query.descending('createdAt');
			query.include('author');
			const results = await query.find();
			return results.map(r => ({
				id: r.id,
				content: r.get('content'),
				media: r.get('media') || [],
				likes: r.get('likes') || 0,
				userId: r.get('author') ? r.get('author').id : null,
				createdAt: r.createdAt
			}));
		}
		return JSON.parse(localStorage.getItem('posts') || '[]');
	}

	async likePost(postId) {
		if (this.provider === 'leancloud') {
			const post = AV.Object.createWithoutData('Post', postId);
			await post.fetch();
			post.increment('likes', 1);
			await post.save();
			return post.get('likes');
		}
		const posts = JSON.parse(localStorage.getItem('posts') || '[]');
		const p = posts.find(x => String(x.id) === String(postId));
		if (p) p.likes += 1;
		localStorage.setItem('posts', JSON.stringify(posts));
		return p ? p.likes : 0;
	}

	async deletePost(postId) {
		if (this.provider === 'leancloud') {
			const post = AV.Object.createWithoutData('Post', postId);
			await post.destroy();
			return true;
		}
		const posts = JSON.parse(localStorage.getItem('posts') || '[]').filter(x => String(x.id) !== String(postId));
		localStorage.setItem('posts', JSON.stringify(posts));
		return true;
	}

	// ========== 文件 ==========
	async uploadFile(file) {
		if (this.provider === 'leancloud') {
			// 兼容 Blob/File
			const avFile = new AV.File(file.name, file);
			await avFile.save();
			return avFile.url();
		}
		// local：转为 dataURL
		return await new Promise((resolve) => {
			const reader = new FileReader();
			reader.onload = e => resolve(e.target.result);
			reader.readAsDataURL(file);
		});
	}
}

window.BackendAdapter = BackendAdapter;

