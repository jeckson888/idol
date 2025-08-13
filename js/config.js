// 配置文件 - 第三方API密钥和设置
const CONFIG = {
    // LeanCloud 配置（国内可用）
    leancloud: {
        appId: 'ne2eYe5hzMpiunKmXTz7Dtwp-gzGzoHsz',
        appKey: 'cMEgqmSyNN0D9WNeLIFK62g8',
        serverURL: 'https://ne2eye5h.lc-cn-n1-shared.com'
    },

    // Unsplash图片API配置
    unsplash: {
        accessKey: 'your_unsplash_access_key', // 需要在Unsplash开发者平台注册获取
        apiUrl: 'https://api.unsplash.com/search/photos'
    },

    // 粒子效果配置
    particles: {
        enabled: true,
        density: 80,
        color: '#ffffff',
        speed: 6
    },

    // 动画配置
    animations: {
        enabled: true,
        duration: 800,
        easing: 'easeOutExpo'
    },

                // 背景图片配置
            backgrounds: {
                enabled: true,
                autoChange: false, // 是否自动切换背景
                changeInterval: 30000, // 切换间隔（毫秒）
                images: [
                    'img/p1.jpg',
                    'img/1.jpg',
                    'img/2.jpg',
                    'img/3.jpg',
                    'img/4.jpg',
                    'img/5.jpg'
                ]
            },

    

    // 音乐配置
    music: {
        enabled: true,
        autoplay: false,
        volume: 0.5,
        defaultTrack: 'img/bg_music.mp3'
    },

    // 数据存储配置
    storage: {
        // provider: 'auto' 优先云端（当 leancloud 配置完整），否则回退 local
        provider: 'auto', // 'auto' | 'leancloud' | 'local'
        prefix: 'idol_diary_',
        encryption: false,
        backup: true
    },

    // 分享配置
    sharing: {
        enabled: true,
        platforms: ['weibo', 'wechat', 'qq']
    },

    // 导出配置
    export: {
        enabled: true,
        formats: ['json', 'csv', 'pdf'],
        includeMedia: true
    }
};

// 获取配置值
function getConfig(path) {
    return path.split('.').reduce((obj, key) => obj && obj[key], CONFIG);
}

// 设置配置值
function setConfig(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, key) => obj[key] = obj[key] || {}, CONFIG);
    target[lastKey] = value;
}

// 保存配置到localStorage
function saveConfig() {
    localStorage.setItem('idol_diary_config', JSON.stringify(CONFIG));
}

// 从localStorage加载配置
function loadConfig() {
    const saved = localStorage.getItem('idol_diary_config');
    if (saved) {
        Object.assign(CONFIG, JSON.parse(saved));
    }
}

// 重置配置
function resetConfig() {
    localStorage.removeItem('idol_diary_config');
    location.reload();
}

// 导出配置
function exportConfig() {
    const blob = new Blob([JSON.stringify(CONFIG, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '偶像日记配置.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 导入配置
function importConfig(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const config = JSON.parse(e.target.result);
                Object.assign(CONFIG, config);
                saveConfig();
                resolve(config);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

// 页面加载时加载配置
document.addEventListener('DOMContentLoaded', loadConfig);

// 导出配置对象和函数
window.CONFIG = CONFIG;
window.getConfig = getConfig;
window.setConfig = setConfig;
window.saveConfig = saveConfig;
window.loadConfig = loadConfig;
window.resetConfig = resetConfig;
window.exportConfig = exportConfig;
window.importConfig = importConfig;
