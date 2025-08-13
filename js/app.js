// 应用状态管理
class AppState {
    constructor() {
        this.currentUser = null;
        this.posts = [];
        this.users = [];
        this.currentPage = 'home';
        this.mediaFiles = [];
        this.isMusicPlaying = false;
        this.galleryView = 'grid';
    }

    // 初始化应用
    init() {
        this.loadData();
        this.setupEventListeners();
        this.checkAuthStatus();
        this.setupMusicControl();
    }

    // 加载数据
    loadData() {
        const savedUsers = localStorage.getItem('users');
        const savedPosts = localStorage.getItem('posts');
        const savedCurrentUser = localStorage.getItem('currentUser');

        if (savedUsers) {
            this.users = JSON.parse(savedUsers);
        }
        if (savedPosts) {
            this.posts = JSON.parse(savedPosts);
        }
        if (savedCurrentUser) {
            this.currentUser = JSON.parse(savedCurrentUser);
        }
    }

    // 保存数据
    saveData() {
        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('posts', JSON.stringify(this.posts));
        if (this.currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
    }

    // 设置音乐控制
    setupMusicControl() {
        const bgMusic = document.getElementById('bgMusic');
        const musicToggle = document.getElementById('musicToggle');
        const musicStatus = document.getElementById('musicStatus');
        const musicControl = document.querySelector('.music-control');

        // 确保音乐不会自动播放
        bgMusic.pause();
        this.isMusicPlaying = false;
        musicStatus.textContent = '音乐已暂停';
        musicToggle.innerHTML = '<i class="fas fa-music"></i>';

        musicToggle.addEventListener('click', () => {
            if (this.isMusicPlaying) {
                bgMusic.pause();
                this.isMusicPlaying = false;
                musicStatus.textContent = '音乐已暂停';
                musicToggle.innerHTML = '<i class="fas fa-music"></i>';
            } else {
                bgMusic.play().catch(e => console.log('音乐播放失败:', e));
                this.isMusicPlaying = true;
                musicStatus.textContent = '音乐播放中';
                musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
            }
        });

        // 监听音乐播放状态
        bgMusic.addEventListener('play', () => {
            this.isMusicPlaying = true;
            musicStatus.textContent = '音乐播放中';
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
        });

        bgMusic.addEventListener('pause', () => {
            this.isMusicPlaying = false;
            musicStatus.textContent = '音乐已暂停';
            musicToggle.innerHTML = '<i class="fas fa-music"></i>';
        });

        // 添加拖拽功能
        this.setupMusicControlDrag(musicControl);
    }

    // 设置音乐控制拖拽功能
    setupMusicControlDrag(musicControl) {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        // 从localStorage加载保存的位置
        const savedPosition = localStorage.getItem('musicControlPosition');
        if (savedPosition) {
            const position = JSON.parse(savedPosition);
            xOffset = position.x;
            yOffset = position.y;
            musicControl.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        }

        // 鼠标按下事件
        musicControl.addEventListener('mousedown', (e) => {
            // 如果点击的是按钮，不启动拖拽
            if (e.target.closest('.music-btn')) {
                return;
            }
            
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            isDragging = true;
            musicControl.style.cursor = 'grabbing';
            musicControl.style.userSelect = 'none';
        });

        // 鼠标移动事件
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;

                // 限制拖拽范围，防止拖出屏幕
                const rect = musicControl.getBoundingClientRect();
                const maxX = window.innerWidth - rect.width;
                const maxY = window.innerHeight - rect.height;

                if (currentX < 0) xOffset = 0;
                if (currentY < 0) yOffset = 0;
                if (currentX > maxX) xOffset = maxX;
                if (currentY > maxY) yOffset = maxY;

                musicControl.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
            }
        });

        // 鼠标释放事件
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                musicControl.style.cursor = 'grab';
                musicControl.style.userSelect = 'auto';
                
                // 保存位置到localStorage
                localStorage.setItem('musicControlPosition', JSON.stringify({
                    x: xOffset,
                    y: yOffset
                }));
            }
        });

        // 触摸事件支持（移动端）
        musicControl.addEventListener('touchstart', (e) => {
            // 如果点击的是按钮，不启动拖拽
            if (e.target.closest('.music-btn')) {
                return;
            }
            
            const touch = e.touches[0];
            initialX = touch.clientX - xOffset;
            initialY = touch.clientY - yOffset;
            isDragging = true;
            musicControl.style.cursor = 'grabbing';
            musicControl.style.userSelect = 'none';
        });

        document.addEventListener('touchmove', (e) => {
            if (isDragging) {
                e.preventDefault();
                const touch = e.touches[0];
                currentX = touch.clientX - initialX;
                currentY = touch.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;

                // 限制拖拽范围
                const rect = musicControl.getBoundingClientRect();
                const maxX = window.innerWidth - rect.width;
                const maxY = window.innerHeight - rect.height;

                if (currentX < 0) xOffset = 0;
                if (currentY < 0) yOffset = 0;
                if (currentX > maxX) xOffset = maxX;
                if (currentY > maxY) yOffset = maxY;

                musicControl.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
            }
        });

        document.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;
                musicControl.style.cursor = 'grab';
                musicControl.style.userSelect = 'auto';
                
                // 保存位置到localStorage
                localStorage.setItem('musicControlPosition', JSON.stringify({
                    x: xOffset,
                    y: yOffset
                }));
            }
        });
    }

    // 设置事件监听器
    setupEventListeners() {
        // 登录表单
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        // 导航菜单
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.dataset.page;
                this.showPage(page);
            });
        });

        // 文件上传
        document.getElementById('imageUpload').addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files, 'image');
        });

        document.getElementById('videoUpload').addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files, 'video');
        });

        document.getElementById('musicUpload').addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files, 'audio');
        });
    }

    // 更换头像
    changeAvatar() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.currentUser.avatar = e.target.result;
                    this.saveData();
                    this.loadProfile();
                    this.renderPosts();
                    this.renderRecentPosts();
                    document.getElementById('userAvatar').src = this.currentUser.avatar;
                    alert('头像更换成功！');
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    // 检查认证状态
    checkAuthStatus() {
        if (this.currentUser) {
            this.showMainApp();
        } else {
            this.showLoginForm();
        }
    }

    // 登录（接入后端适配器）
    async login() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        try {
            const user = await window.backend.login(username, password);
            this.currentUser = user;
            this.saveData();
            this.showMainApp();
            await this.fetchAndRenderPosts();
            this.updateStats();
            this.renderGallery();
            this.renderTimeline();
            this.renderRecentPosts();
            this.loadProfile();
        } catch (e) {
            console.log('登录失败:', e);
            alert('用户名或密码错误！\n\n可用账户（本地演示）：\n用户名：demo_user 密码：123456\n用户名：fan_user 密码：123456');
        }
    }

    // 退出登录
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.showLoginForm();
    }

    // 显示主应用
    showMainApp() {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('appPage').style.display = 'block';
        document.getElementById('userName').textContent = this.currentUser.nickname || this.currentUser.username;
        document.getElementById('heroUserName').textContent = this.currentUser.nickname || this.currentUser.username;
    }

    // 显示登录表单
    showLoginForm() {
        document.getElementById('loginPage').style.display = 'flex';
        document.getElementById('appPage').style.display = 'none';
    }

    // 显示页面
    showPage(pageName) {
        // 隐藏所有页面
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // 移除所有导航链接的active类
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // 显示目标页面
        document.getElementById(pageName + 'Page').classList.add('active');
        
        // 激活对应的导航链接
        document.querySelector(`[data-page="${pageName}"]`).classList.add('active');
        
        this.currentPage = pageName;

        // 根据页面加载相应数据
        switch (pageName) {
            case 'home':
                this.updateStats();
                this.renderRecentPosts();
                break;
            case 'diary':
                this.renderPosts();
                break;
            case 'gallery':
                this.renderGallery();
                break;
            case 'timeline':
                this.renderTimeline();
                break;
            case 'profile':
                this.loadProfile();
                break;
        }
    }

    // 更新统计数据
    updateStats() {
        const userPosts = this.posts.filter(post => post.userId === this.currentUser.id);
        const images = userPosts.filter(post => post.media.some(m => m.type === 'image')).length;
        const music = userPosts.filter(post => post.media.some(m => m.type === 'audio')).length;
        const totalLikes = userPosts.reduce((sum, post) => sum + post.likes, 0);

        document.getElementById('totalPosts').textContent = userPosts.length;
        document.getElementById('totalImages').textContent = images;
        document.getElementById('totalMusic').textContent = music;
        document.getElementById('totalLikes').textContent = totalLikes;
    }

    // 处理文件上传（云端文件存储：返回 URL）
    async handleFileUpload(files, type) {
        if (!files || files.length === 0) return;
        for (const file of Array.from(files)) {
            let data;
            try {
                data = await window.backend.uploadFile(file); // 云端返回 URL，本地返回 dataURL
            } catch (e) {
                console.log('文件上传失败，回退本地dataURL:', e);
                data = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = ev => resolve(ev.target.result);
                    reader.readAsDataURL(file);
                });
            }
            const mediaItem = {
                id: Date.now() + Math.random(),
                type,
                name: file.name,
                data,
                size: file.size
            };
            this.mediaFiles.push(mediaItem);
            this.renderMediaPreview();
        }
    }

    // 渲染媒体预览
    renderMediaPreview() {
        const preview = document.getElementById('mediaPreview');
        preview.innerHTML = '';

        this.mediaFiles.forEach((media, index) => {
            const mediaElement = document.createElement('div');
            mediaElement.className = 'media-item';
            
            let mediaContent = '';
            if (media.type === 'image') {
                mediaContent = `<img src="${media.data}" alt="${media.name}">`;
            } else if (media.type === 'video') {
                mediaContent = `<video controls><source src="${media.data}" type="video/mp4"></video>`;
            } else if (media.type === 'audio') {
                mediaContent = `<audio controls><source src="${media.data}" type="audio/mpeg"></audio>`;
            }

            mediaElement.innerHTML = `
                ${mediaContent}
                <button class="remove-media" onclick="removeMedia(${index})">×</button>
            `;
            
            preview.appendChild(mediaElement);
        });
    }

    // 移除媒体文件
    removeMedia(index) {
        this.mediaFiles.splice(index, 1);
        this.renderMediaPreview();
    }

    // 创建动态（接入后端适配器）
    async createPost() {
        const content = document.getElementById('postContent').value.trim();
        
        if (!content && this.mediaFiles.length === 0) {
            alert('请输入内容或上传媒体文件！');
            return;
        }

        // 发送到后端
        const created = await window.backend.createPost({
            content,
            media: [...this.mediaFiles],
            authorId: this.currentUser.id
        });

        this.posts.unshift(created);
        this.saveData();
        
        // 清空表单
        document.getElementById('postContent').value = '';
        this.mediaFiles = [];
        this.renderMediaPreview();
        hideNewPostForm();
        
        // 更新显示
        this.updateStats();
        this.renderPosts();
        this.renderGallery();
        this.renderTimeline();
        this.renderRecentPosts();
        
        alert('动态发布成功！');
    }

    // 渲染动态列表
    renderPosts() {
        const container = document.getElementById('postsContainer');
        const userPosts = this.posts.filter(post => post.userId === this.currentUser.id);
        
        if (userPosts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book" style="font-size: 48px; color: #ccc; margin-bottom: 20px;"></i>
                    <p>还没有发布过动态，快来发布第一条吧！</p>
                    <button class="cta-btn primary" onclick="showNewPostForm()">
                        <i class="fas fa-plus"></i> 发布动态
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = userPosts.map(post => this.createPostHTML(post)).join('');
    }

    // 创建动态HTML
    createPostHTML(post) {
        const mediaHTML = post.media.length > 0 ? `
            <div class="post-media">
                ${post.media.map(media => {
                    if (media.type === 'image') {
                        return `<img src="${media.data}" alt="${media.name}" onclick="showMediaModal('${media.data}')">`;
                    } else if (media.type === 'video') {
                        return `<video controls><source src="${media.data}" type="video/mp4"></video>`;
                    } else if (media.type === 'audio') {
                        return `<audio controls><source src="${media.data}" type="audio/mpeg"></audio>`;
                    }
                }).join('')}
            </div>
        ` : '';

        return `
            <div class="post-card">
                <div class="post-header">
                    <img src="${this.currentUser.avatar}" alt="头像" class="post-avatar">
                    <div class="post-info">
                        <h4>${this.currentUser.nickname || this.currentUser.username}</h4>
                        <div class="post-time">${this.formatDate(post.createdAt)}</div>
                    </div>
                </div>
                <div class="post-content">${post.content}</div>
                ${mediaHTML}
                <div class="post-actions">
                    <button class="action-btn" onclick="likePost(${post.id})">
                        <i class="fas fa-heart"></i> ${post.likes}
                    </button>
                    <button class="action-btn" onclick="deletePost(${post.id})">
                        <i class="fas fa-trash"></i> 删除
                    </button>
                </div>
            </div>
        `;
    }

    // 渲染相册
    renderGallery() {
        const container = document.getElementById('galleryContainer');
        const userPosts = this.posts.filter(post => post.userId === this.currentUser.id);
        const images = [];

        userPosts.forEach(post => {
            post.media.forEach(media => {
                if (media.type === 'image') {
                    images.push({
                        ...media,
                        postId: post.id,
                        createdAt: post.createdAt
                    });
                }
            });
        });

        if (images.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-images" style="font-size: 48px; color: #ccc; margin-bottom: 20px;"></i>
                    <p>还没有上传过图片</p>
                    <button class="cta-btn primary" onclick="showPage('diary'); showNewPostForm()">
                        <i class="fas fa-plus"></i> 发布带图片的动态
                    </button>
                </div>
            `;
            return;
        }

        const isListView = this.galleryView === 'list';
        container.className = `gallery-container ${isListView ? 'list-view' : ''}`;

        container.innerHTML = images.map(image => `
            <div class="gallery-item">
                <img src="${image.data}" alt="${image.name}" onclick="showMediaModal('${image.data}')">
                <div class="gallery-info">
                    <h4>${image.name}</h4>
                    <p>${this.formatDate(image.createdAt)}</p>
                </div>
            </div>
        `).join('');
    }

    // 切换相册视图
    switchGalleryView(view) {
        this.galleryView = view;
        
        // 更新按钮状态
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 根据view参数找到对应的按钮
        const buttons = document.querySelectorAll('.view-btn');
        if (view === 'grid') {
            buttons[0].classList.add('active');
        } else if (view === 'list') {
            buttons[1].classList.add('active');
        }
        
        this.renderGallery();
    }

    // 渲染时间线
    renderTimeline() {
        const container = document.getElementById('timelineContainer');
        const userPosts = this.posts.filter(post => post.userId === this.currentUser.id);
        
        if (userPosts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-alt" style="font-size: 48px; color: #ccc; margin-bottom: 20px;"></i>
                    <p>还没有发布过动态</p>
                    <button class="cta-btn primary" onclick="showPage('diary'); showNewPostForm()">
                        <i class="fas fa-plus"></i> 发布动态
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = userPosts.map(post => `
            <div class="timeline-item">
                <div class="timeline-date">${this.formatDate(post.createdAt)}</div>
                <div class="timeline-content">${post.content}</div>
                ${post.media.length > 0 ? `
                    <div class="timeline-media">
                        ${post.media.map(media => {
                            if (media.type === 'image') {
                                return `<img src="${media.data}" alt="${media.name}" onclick="showMediaModal('${media.data}')">`;
                            }
                            return '';
                        }).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    // 渲染最近动态预览
    renderRecentPosts() {
        const container = document.getElementById('recentPostsGrid');
        const userPosts = this.posts.filter(post => post.userId === this.currentUser.id).slice(0, 3);
        
        if (userPosts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clock" style="font-size: 48px; color: #ccc; margin-bottom: 20px;"></i>
                    <p>还没有发布过动态</p>
                    <button class="cta-btn primary" onclick="showPage('diary'); showNewPostForm()">
                        <i class="fas fa-plus"></i> 发布动态
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = userPosts.map(post => `
            <div class="post-card">
                <div class="post-header">
                    <img src="${this.currentUser.avatar}" alt="头像" class="post-avatar">
                    <div class="post-info">
                        <h4>${this.currentUser.nickname || this.currentUser.username}</h4>
                        <div class="post-time">${this.formatDate(post.createdAt)}</div>
                    </div>
                </div>
                <div class="post-content">${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}</div>
                ${post.media.length > 0 ? `
                    <div class="post-media">
                        ${post.media.slice(0, 1).map(media => {
                            if (media.type === 'image') {
                                return `<img src="${media.data}" alt="${media.name}" onclick="showMediaModal('${media.data}')">`;
                            }
                            return '';
                        }).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    // 加载个人资料
    loadProfile() {
        document.getElementById('profileUsername').value = this.currentUser.username;
        document.getElementById('profileNickname').value = this.currentUser.nickname || '';
        document.getElementById('profileBio').value = this.currentUser.bio || '';
        document.getElementById('profileIdol').value = this.currentUser.idol || '';
        document.getElementById('profileJoinDate').value = this.formatDate(this.currentUser.createdAt);
        document.getElementById('userAvatar').src = this.currentUser.avatar;
        document.getElementById('profileAvatar').src = this.currentUser.avatar;
    }

    // 保存个人资料
    saveProfile() {
        this.currentUser.nickname = document.getElementById('profileNickname').value;
        this.currentUser.bio = document.getElementById('profileBio').value;
        this.currentUser.idol = document.getElementById('profileIdol').value;
        
        // 更新用户列表中的当前用户
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            this.users[userIndex] = { ...this.currentUser };
        }
        
        this.saveData();
        document.getElementById('userName').textContent = this.currentUser.nickname || this.currentUser.username;
        document.getElementById('heroUserName').textContent = this.currentUser.nickname || this.currentUser.username;
        alert('个人资料保存成功！');
    }

    // 点赞动态（接入后端适配器）
    async likePost(postId) {
        const likes = await window.backend.likePost(postId);
        const post = this.posts.find(p => p.id === postId);
        if (post) post.likes = likes;
        this.saveData();
        this.updateStats();
        this.renderPosts();
        this.renderRecentPosts();
    }

    // 删除动态（接入后端适配器）
    async deletePost(postId) {
        if (!confirm('确定要删除这条动态吗？')) return;
        await window.backend.deletePost(postId);
        this.posts = this.posts.filter(p => p.id !== postId);
        this.saveData();
        this.updateStats();
        this.renderPosts();
        this.renderGallery();
        this.renderTimeline();
        this.renderRecentPosts();
    }

    async fetchAndRenderPosts() {
        this.posts = await window.backend.listPosts();
        this.renderPosts();
    }

    // 显示媒体模态框
    showMediaModal(src) {
        const modal = document.createElement('div');
        modal.className = 'media-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <img src="${src}" alt="媒体预览">
            </div>
        `;
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.className === 'close-modal') {
                document.body.removeChild(modal);
            }
        });
        
        document.body.appendChild(modal);
    }

    // 格式化日期
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return '刚刚';
        if (minutes < 60) return `${minutes}分钟前`;
        if (hours < 24) return `${hours}小时前`;
        if (days < 7) return `${days}天前`;
        
        return date.toLocaleDateString();
    }
}

// 全局函数
function showPage(pageName) {
    app.showPage(pageName);
}

function showNewPostForm() {
    document.getElementById('newPostForm').style.display = 'block';
}

function hideNewPostForm() {
    document.getElementById('newPostForm').style.display = 'none';
    document.getElementById('postContent').value = '';
    app.mediaFiles = [];
    app.renderMediaPreview();
}

function logout() {
    app.logout();
}

function createPost() {
    app.createPost();
}

function switchGalleryView(view) {
    app.switchGalleryView(view);
}

function changeAvatar() {
    app.changeAvatar();
}

function saveProfile() {
    app.saveProfile();
}

function removeMedia(index) {
    app.removeMedia(index);
}

function likePost(postId) {
    app.likePost(postId);
}

function deletePost(postId) {
    app.deletePost(postId);
}

function showMediaModal(src) {
    app.showMediaModal(src);
}

// 初始化应用
const app = new AppState();
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// 添加媒体模态框样式
const modalStyle = document.createElement('style');
modalStyle.textContent = `
    .media-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    }
    
    .modal-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
    }
    
    .modal-content img {
        width: 100%;
        height: auto;
        border-radius: 10px;
    }
    
    .close-modal {
        position: absolute;
        top: -40px;
        right: 0;
        color: white;
        font-size: 30px;
        cursor: pointer;
    }
    
    .empty-state {
        text-align: center;
        padding: 40px;
        color: #666;
    }
    
    .timeline-media {
        margin-top: 15px;
    }
    
    .timeline-media img {
        max-width: 200px;
        border-radius: 8px;
        cursor: pointer;
    }
`;
document.head.appendChild(modalStyle);
