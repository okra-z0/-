/**
 * 音频管理器 - 端午知识闯关游戏
 * 管理游戏中的所有音效和背景音乐
 */

class AudioManager {
    constructor() {
        this.isEnabled = true;
        this.volume = 0.7;
        this.sounds = {};
        this.backgroundMusic = null;
        
        // 初始化音频
        this.initAudio();
        
        // 绑定用户交互事件（解决自动播放限制）
        this.bindUserInteraction();
    }
    
    /**
     * 初始化音频资源
     */
    initAudio() {
        // 使用Web Audio API创建音效
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createSounds();
        } catch (e) {
            console.log('Web Audio API不支持，使用HTML5 Audio');
            this.createHTMLAudio();
        }
    }
    
    /**
     * 创建音效（使用Web Audio API）
     */
    createSounds() {
        // 正确答案音效 - 清脆的铃声
        this.sounds.correct = this.createTone(800, 0.3, 'sine');
        
        // 错误答案音效 - 低沉的提示音
        this.sounds.wrong = this.createTone(200, 0.5, 'sawtooth');
        
        // 点击音效 - 轻快的点击声
        this.sounds.click = this.createTone(600, 0.1, 'square');
        
        // 完成游戏音效 - 胜利音乐
        this.sounds.complete = this.createMelody([
            {freq: 523, duration: 0.2}, // C5
            {freq: 659, duration: 0.2}, // E5
            {freq: 784, duration: 0.2}, // G5
            {freq: 1047, duration: 0.4} // C6
        ]);
        
        // 背景音乐 - 轻柔的中国风旋律
        this.createBackgroundMusic();
    }
    
    /**
     * 创建HTML5音频（备用方案）
     */
    createHTMLAudio() {
        // 如果有实际音频文件，可以这样加载
        // this.sounds.correct = new Audio('assets/audio/correct.mp3');
        // this.sounds.wrong = new Audio('assets/audio/wrong.mp3');
        // this.sounds.click = new Audio('assets/audio/click.mp3');
        // this.sounds.complete = new Audio('assets/audio/complete.mp3');
        
        // 设置音量
        Object.values(this.sounds).forEach(audio => {
            if (audio instanceof Audio) {
                audio.volume = this.volume;
                audio.preload = 'auto';
            }
        });
    }
    
    /**
     * 创建单音调
     */
    createTone(frequency, duration, type = 'sine') {
        return () => {
            if (!this.isEnabled || !this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }
    
    /**
     * 创建旋律
     */
    createMelody(notes) {
        return () => {
            if (!this.isEnabled || !this.audioContext) return;
            
            let currentTime = this.audioContext.currentTime;
            
            notes.forEach(note => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(note.freq, currentTime);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, currentTime);
                gainNode.gain.linearRampToValueAtTime(this.volume * 0.2, currentTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + note.duration);
                
                oscillator.start(currentTime);
                oscillator.stop(currentTime + note.duration);
                
                currentTime += note.duration;
            });
        };
    }
    
    /**
     * 创建背景音乐
     */
    createBackgroundMusic() {
        // 简单的中国风五声音阶旋律
        const pentatonicScale = [523, 587, 659, 784, 880]; // C D E G A
        const melody = [];
        
        // 生成随机但和谐的旋律
        for (let i = 0; i < 16; i++) {
            const noteIndex = Math.floor(Math.random() * pentatonicScale.length);
            melody.push({
                freq: pentatonicScale[noteIndex],
                duration: 0.5
            });
        }
        
        this.backgroundMusic = () => {
            if (!this.isEnabled || !this.audioContext) return;
            
            let currentTime = this.audioContext.currentTime;
            
            melody.forEach(note => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(note.freq, currentTime);
                oscillator.type = 'triangle';
                
                gainNode.gain.setValueAtTime(0, currentTime);
                gainNode.gain.linearRampToValueAtTime(this.volume * 0.1, currentTime + 0.1);
                gainNode.gain.linearRampToValueAtTime(0, currentTime + note.duration - 0.1);
                
                oscillator.start(currentTime);
                oscillator.stop(currentTime + note.duration);
                
                currentTime += note.duration;
            });
            
            // 循环播放
            if (this.isBackgroundPlaying) {
                setTimeout(() => {
                    if (this.isBackgroundPlaying) {
                        this.backgroundMusic();
                    }
                }, melody.length * 500);
            }
        };
    }
    
    /**
     * 绑定用户交互事件
     */
    bindUserInteraction() {
        const startAudio = () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            document.removeEventListener('click', startAudio);
            document.removeEventListener('touchstart', startAudio);
        };
        
        document.addEventListener('click', startAudio);
        document.addEventListener('touchstart', startAudio);
    }
    
    /**
     * 播放音效
     */
    play(soundName) {
        if (!this.isEnabled) return;
        
        if (this.sounds[soundName]) {
            try {
                if (typeof this.sounds[soundName] === 'function') {
                    this.sounds[soundName]();
                } else if (this.sounds[soundName] instanceof Audio) {
                    this.sounds[soundName].currentTime = 0;
                    this.sounds[soundName].play().catch(e => {
                        console.log('音频播放失败:', e);
                    });
                }
            } catch (e) {
                console.log('音效播放错误:', e);
            }
        }
    }
    
    /**
     * 播放背景音乐
     */
    playBackground() {
        if (!this.isEnabled || this.isBackgroundPlaying) return;
        
        this.isBackgroundPlaying = true;
        if (this.backgroundMusic) {
            this.backgroundMusic();
        }
    }
    
    /**
     * 停止背景音乐
     */
    stopBackground() {
        this.isBackgroundPlaying = false;
    }
    
    /**
     * 切换音频开关
     */
    toggle() {
        this.isEnabled = !this.isEnabled;
        
        if (!this.isEnabled) {
            this.stopBackground();
        }
        
        return this.isEnabled;
    }
    
    /**
     * 设置音量
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        
        // 更新HTML5音频音量
        Object.values(this.sounds).forEach(audio => {
            if (audio instanceof Audio) {
                audio.volume = this.volume;
            }
        });
    }
    
    /**
     * 获取音频状态
     */
    getStatus() {
        return {
            enabled: this.isEnabled,
            volume: this.volume,
            backgroundPlaying: this.isBackgroundPlaying
        };
    }
    
    /**
     * 预加载音频（如果使用外部文件）
     */
    preload(audioFiles) {
        const promises = [];
        
        Object.entries(audioFiles).forEach(([name, url]) => {
            const audio = new Audio(url);
            audio.volume = this.volume;
            audio.preload = 'auto';
            
            const promise = new Promise((resolve, reject) => {
                audio.addEventListener('canplaythrough', resolve);
                audio.addEventListener('error', reject);
            });
            
            this.sounds[name] = audio;
            promises.push(promise);
        });
        
        return Promise.all(promises);
    }
    
    /**
     * 销毁音频管理器
     */
    destroy() {
        this.stopBackground();
        
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        Object.values(this.sounds).forEach(audio => {
            if (audio instanceof Audio) {
                audio.pause();
                audio.src = '';
            }
        });
        
        this.sounds = {};
    }
}

// 创建全局音频管理器实例
const audioManager = new AudioManager();

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}