// 演示数据
const demoData = {
    users: [
        {
            id: 1,
            username: "demo_user",
            email: "demo@example.com",
            password: "123456",
            nickname: "偶像日记达人",
            bio: "热爱记录与偶像的每一个美好瞬间，从2015年开始喜欢易烊千玺，他是我学习的榜样！",
            idol: "易烊千玺",
            avatar: "img/icon.jpg",
            createdAt: "2024-01-01T00:00:00.000Z"
        },
        {
            id: 2,
            username: "fan_user",
            email: "fan@example.com",
            password: "123456",
            nickname: "追星少女",
            bio: "TFBOYS忠实粉丝，喜欢他们的音乐和正能量！",
            idol: "TFBOYS",
            avatar: "img/icon.jpg",
            createdAt: "2024-01-15T00:00:00.000Z"
        }
    ],
    posts: [
        {
            id: 1,
            userId: 1,
            content: "今天看了偶像的新电影《少年的你》，演技真的太棒了！每一个表情都那么到位，不愧是实力派演员。期待下次的作品！",
            media: [],
            createdAt: "2024-01-15T10:30:00.000Z",
            likes: 5,
            comments: []
        },
        {
            id: 2,
            userId: 1,
            content: "偶像的新歌《舒适圈》太好听了！单曲循环中，歌词写得很有深度，旋律也很抓耳。",
            media: [
                {
                    id: 101,
                    type: "image",
                    name: "偶像照片.jpg",
                    data: "img/2.jpg",
                    size: 1024000
                }
            ],
            createdAt: "2024-01-14T15:20:00.000Z",
            likes: 8,
            comments: []
        },
        {
            id: 3,
            userId: 1,
            content: "今天在微博上看到偶像的日常分享，生活中的他也很可爱呢！",
            media: [
                {
                    id: 102,
                    type: "image",
                    name: "日常照片.jpg",
                    data: "img/3.jpg",
                    size: 2048000
                }
            ],
            createdAt: "2024-01-13T09:15:00.000Z",
            likes: 12,
            comments: []
        },
        {
            id: 4,
            userId: 1,
            content: "偶像的舞蹈真的太帅了！每一个动作都那么流畅，不愧是舞蹈担当！",
            media: [
                {
                    id: 103,
                    type: "image",
                    name: "舞蹈照片.jpg",
                    data: "img/4.jpg",
                    size: 1536000
                }
            ],
            createdAt: "2024-01-12T14:45:00.000Z",
            likes: 15,
            comments: []
        },
        {
            id: 5,
            userId: 1,
            content: "今天听了偶像的《朋友请听好》，声音太温暖了，治愈系男神！",
            media: [],
            createdAt: "2024-01-11T20:30:00.000Z",
            likes: 7,
            comments: []
        },
        {
            id: 6,
            userId: 2,
            content: "TFBOYS的新歌太好听了！三小只的声音完美融合，期待他们的演唱会！",
            media: [
                {
                    id: 201,
                    type: "image",
                    name: "TFBOYS合照.jpg",
                    data: "img/5.jpg",
                    size: 2560000
                }
            ],
            createdAt: "2024-01-10T16:20:00.000Z",
            likes: 20,
            comments: []
        },
        {
            id: 7,
            userId: 2,
            content: "今天看了TFBOYS的综艺节目，他们真的太可爱了！",
            media: [],
            createdAt: "2024-01-09T11:10:00.000Z",
            likes: 6,
            comments: []
        }
    ]
};

// 初始化演示数据
function initDemoData() {
    // 强制重新初始化演示数据，确保用户数据存在
    localStorage.setItem('users', JSON.stringify(demoData.users));
    localStorage.setItem('posts', JSON.stringify(demoData.posts));
}

// 快速登录函数
function quickLogin(username, password) {
    document.getElementById('username').value = username;
    document.getElementById('password').value = password;
    // 触发登录
    const loginForm = document.getElementById('loginForm');
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    loginForm.dispatchEvent(submitEvent);
}

// 页面加载时初始化演示数据
document.addEventListener('DOMContentLoaded', () => {
    initDemoData();
});
