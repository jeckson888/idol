// 第三方API和SDK集成
class ThirdPartyServices {
    constructor() {
        this.weatherApiKey = 'your_weather_api_key'; // 和风天气API密钥
        this.baiduMapKey = 'your_baidu_map_key'; // 百度地图API密钥
        this.init();
    }

                    // 初始化所有第三方服务
                init() {
                    // 粒子效果已关闭
                    this.initAnimations();
                    this.initLazyLoading();
                }

    

    // 初始化动画
    initAnimations() {
        if (typeof anime !== 'undefined') {
            // 页面加载动画
            anime.timeline({ easing: 'easeOutExpo' })
                .add({
                    targets: '.hero-content h1',
                    translateY: [50, 0],
                    opacity: [0, 1],
                    duration: 1000
                })
                .add({
                    targets: '.hero-content p',
                    translateY: [30, 0],
                    opacity: [0, 1],
                    duration: 800
                }, '-=600')
                .add({
                    targets: '.hero-buttons',
                    translateY: [30, 0],
                    opacity: [0, 1],
                    duration: 800
                }, '-=400')
                .add({
                    targets: '.stat-card',
                    translateY: [50, 0],
                    opacity: [0, 1],
                    duration: 800,
                    delay: anime.stagger(100)
                }, '-=600');

            // 卡片悬停动画
            document.querySelectorAll('.stat-card, .post-card, .gallery-item').forEach(card => {
                card.addEventListener('mouseenter', function() {
                    anime({
                        targets: this,
                        scale: 1.02,
                        duration: 300
                    });
                });

                card.addEventListener('mouseleave', function() {
                    anime({
                        targets: this,
                        scale: 1,
                        duration: 300
                    });
                });
            });
        }
    }

    // 初始化懒加载
    initLazyLoading() {
        if (typeof lozad !== 'undefined') {
            const observer = lozad('.lazy', {
                loaded: function(el) {
                    el.classList.add('loaded');
                }
            });
            observer.observe();
        }
    }

                    // 获取随机背景图片（优先读取配置中的本地img列表）
                getRandomBackgroundImage() {
                    const configImages = (window.CONFIG && window.CONFIG.backgrounds && window.CONFIG.backgrounds.images)
                        ? window.CONFIG.backgrounds.images
                        : [
                            'img/p1.jpg',
                            'img/1.jpg',
                            'img/2.jpg',
                            'img/3.jpg',
                            'img/4.jpg',
                            'img/5.jpg'
                        ];
                    return configImages[Math.floor(Math.random() * configImages.length)];
                }

    // 更新背景图片
    updateBackground() {
        const backgroundContainer = document.getElementById('background-container');
        if (backgroundContainer) {
            const newBackground = this.getRandomBackgroundImage();
            backgroundContainer.style.backgroundImage = `url('${newBackground}')`;
        }
    }

    // 获取偶像相关图片
    async getIdolImages(query = 'idol') {
        try {
            // 这里可以集成图片API，如Unsplash API
            // 目前返回模拟数据
            return [
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            ];
        } catch (error) {
            console.log('获取图片失败:', error);
            return [];
        }
    }

    // 分享功能
    shareContent(content, url) {
        if (navigator.share) {
            navigator.share({
                title: '再一，再二，再三',
                text: content,
                url: url
            });
        } else {
            // 复制到剪贴板
            navigator.clipboard.writeText(content).then(() => {
                alert('内容已复制到剪贴板！');
            });
        }
    }

    // 导出数据
    exportData(data, filename = '再一，再二，再三数据.json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 导入数据
    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }
}

// 全局实例
let thirdPartyServices;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    thirdPartyServices = new ThirdPartyServices();
});

// 导出供其他文件使用
window.ThirdPartyServices = ThirdPartyServices;
