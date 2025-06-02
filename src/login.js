if (!document.getElementById('login-breath-modal')) {
    const modal = document.createElement('div');
    modal.id = 'login-breath-modal';
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.18)';
    modal.style.backdropFilter = 'blur(2px)';
    modal.style.zIndex = '1000000';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.innerHTML = `
        <div id="login-register-content" style="background:#fff;border-radius:18px;box-shadow:0 8px 32px rgba(149,157,165,0.18);padding:2.5rem 2.5rem 2rem;min-width:320px;width:75vw;max-width:720px;animation:breathPop 0.5s;position:relative;display:flex;flex-direction:column;align-items:center;">
            <button id="close-login-breath" style="position:absolute;top:18px;right:18px;background:none;border:none;font-size:1.3rem;color:#aaa;cursor:pointer;">&times;</button>
            <div id="login-key-icon" style="font-size:3rem;margin-bottom:1rem;">🔑</div>
            <div id="login-register-title" style="font-size:1.2rem;font-weight:bold;color:var(--primary);margin-bottom:1.2rem;">登录你的快乐账号</div>
            <div id="login-form">
                <input type="text" placeholder="地址" autocomplete="username" style="width:100%;margin-bottom:12px;padding:8px 14px;border-radius:10px;border:1px solid #eee;font-size:1rem;">
                <input type="password" placeholder="私钥" style="width:100%;margin-bottom:18px;padding:8px 14px;border-radius:10px;border:1px solid #eee;font-size:1rem;">
                <button style="width:100%;background:linear-gradient(135deg, var(--primary), var(--secondary));color:#fff;font-weight:700;font-size:1.1rem;padding:10px 0;border:none;border-radius:12px;box-shadow:0 2px 8px var(--shadow);cursor:pointer;transition:background 0.2s;">登录</button>
            </div>
            <div id="register-form" style="display:none;">
                <label style="font-weight:bold;">你的 happy 链地址</label>
                <button type="button" id="copy-address" style="
                    margin-bottom:10px;
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    color: #fff;
                    border: none;
                    border-radius: 20px;
                    padding: 6px 18px;
                    font-size: 1rem;
                    cursor: pointer;
                    box-shadow: 0 2px 8px var(--shadow);
                    transition: background 0.2s;
                    outline: none;
                ">复制地址</button>
                <input type="text" id="happy-address" readonly style="width:100%;word-break: break-all;margin-bottom:12px;padding:8px 14px;border-radius:10px;border:1px solid #eee;font-size:1rem;background:#f7f7f7;">
                <label style="font-weight:bold;">你的私钥</label>
                <button type="button" id="copy-private" style="
                    margin-bottom:10px;
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    color: #fff;
                    border: none;
                    border-radius: 20px;
                    padding: 6px 18px;
                    font-size: 1rem;
                    cursor: pointer;
                    box-shadow: 0 2px 8px var(--shadow);
                    transition: background 0.2s;
                    outline: none;
                ">复制私钥</button>
                <p>
                    <label style="font-weight:bold;">⚠️私钥丢失将永久丢失⚠️</label>
                </p>
                <textarea id="happy-private" readonly style="width:100%;margin-bottom:12px;padding:8px 14px;border-radius:10px;border:1px solid #eee;font-size:1rem;background:#f7f7f7;min-height:48px;"></textarea>
                <button id="register-btn" style="width:100%;background:linear-gradient(135deg, var(--primary), var(--secondary));color:#fff;font-weight:700;font-size:1.1rem;padding:10px 0;border:none;border-radius:12px;box-shadow:0 2px 8px var(--shadow);cursor:pointer;transition:background 0.2s;">
                    获取密钥对♾️可多次获取
                </button>
                <div style="color:#e67e22;font-size:0.95rem;margin-top:8px;">请务必保存好私钥，丢失无法找回！</div>
            </div>
            <div style="margin-top:1rem;font-size:0.95rem;color:#888;">
                <span id="toggle-login-register" style="color:var(--primary);cursor:pointer;text-decoration:underline;">没有地址？获取一个➡️</span>
            </div>
            <div id="user-info" style="display:none;text-align:center;">
                <div style="font-size:2.2rem;margin-bottom:1rem;">😊</div>
                <div style="font-weight:bold;font-size:1.1rem;margin-bottom:0.5rem;">已登录</div>
                <div id="user-address" style="word-break:break-all;color:var(--primary);margin-bottom:1rem;"></div>
                <span id="transfer-btn" style="color:var(--primary);cursor:pointer;text-decoration:underline;">在Happy区块链上发送Coins➡️</span>
                <div id="user-coins-list" style="margin-bottom:1rem;"></div>
                <button id="logout-btn" style="background:var(--primary);color:#fff;border:none;border-radius:12px;padding:8px 24px;cursor:pointer;">退出登录</button>
            </div>
            <!-- 发送弹窗 -->
            <div id="transfer-modal" style="display:none;position:fixed;left:0;top:0;width:100vw;height:100vh;background:rgba(0,0,0,0.2);align-items:center;justify-content:center;z-index:999;">
                <div id="transfer-content" style="background:#fff;border-radius:18px;box-shadow:0 8px 32px rgba(149,157,165,0.18);padding:2.5rem 2.5rem 2rem;min-width:320px;max-width:420px;animation:breathPop 0.5s;position:relative;display:flex;flex-direction:column;align-items:center;">
                    <button id="close-transfer" style="position:absolute;top:18px;right:18px;background:none;border:none;font-size:1.3rem;color:#aaa;cursor:pointer;">&times;</button>
                    <div style="font-size:2.2rem;margin-bottom:1rem;">🪙</div>
                    <h3 style="margin-bottom:1rem;">在Happy区块链内发送%Coins%</h3>
                    <div style="margin-bottom:1rem;width:100%;">
                        <input id="transfer-address" type="text" placeholder="对方地址" style="width:100%;padding:8px 14px;border-radius:10px;border:1px solid #eee;">
                    </div>
                    <!-- 发送弹窗内币种选择框 -->
                    <div style="margin-bottom:1rem;width:100%;">
                        <input id="transfer-coin-type" type="text" value="Happy币" readonly
                            style="width:100%;padding:8px 14px;border-radius:10px;border:1px solid #eee;cursor:pointer;background:#f7f7f7;" />
                    </div>
                    <div style="margin-bottom:1rem;width:100%;">
                        <input id="transfer-amount" type="number" min="1" placeholder="数量" style="width:100%;padding:8px 14px;border-radius:10px;border:1px solid #eee;">
                    </div>
                    <button id="transfer-confirm" style="width:100%;background:var(--primary);color:#fff;border:none;border-radius:12px;padding:10px 0;cursor:pointer;">确认发送</button>
                    <button id="transfer-cancel" style="width:100%;margin-top:8px;background:#eee;color:#888;border:none;border-radius:12px;padding:10px 0;cursor:pointer;">取消</button>
                </div>
            </div>
            <!-- 币种选择弹窗 -->
            <div id="coin-select-modal" style="display:none;position:fixed;left:0;top:0;width:100vw;height:100vh;background:rgba(0,0,0,0.18);align-items:center;justify-content:center;z-index:1000001;">
                <div style="background:#fff;border-radius:18px;box-shadow:0 8px 32px rgba(149,157,165,0.18);padding:2rem 2.5rem;min-width:220px;animation:breathPop 0.5s;display:flex;flex-direction:column;align-items:center;">
                    <div style="font-size:1.2rem;font-weight:bold;margin-bottom:1.2rem;">选择币种</div>
                    <button class="coin-option" data-type="happyCoins" style="margin-bottom:10px;width:100%;padding:10px 0;border-radius:10px;border:1px solid #eee;background:#f7f7f7;cursor:pointer;">Happy币</button>
                    <button class="coin-option" data-type="testCoins" style="margin-bottom:10px;width:100%;padding:10px 0;border-radius:10px;border:1px solid #eee;background:#f7f7f7;cursor:pointer;">测试币</button>
                    <!-- 未来可动态添加更多币种 -->
                    <button id="close-coin-select" style="margin-top:10px;width:100%;background:#eee;color:#888;border:none;border-radius:10px;padding:10px 0;cursor:pointer;">取消</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // ===============================
    // 🌟 登录/注册弹窗核心逻辑区 🌟
    // ===============================

    // 检查本地是否已登录，自动切换到用户信息界面
    // --------------------------------

    const savedAddress = localStorage.getItem('happy_login_address');
    if (savedAddress) {
        // 🎉 已登录，直接展示用户信息
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('user-info').style.display = '';
        document.getElementById('user-address').textContent = savedAddress;
        document.getElementById('login-register-title').style.display = 'none';
        document.getElementById('toggle-login-register').style.display = 'none';
        document.getElementById('login-key-icon').style.display = 'none';
        window.currentUserAddress = savedAddress;
        updateHappyChainCoin(savedAddress);
    }

    // ===============================
    // 🚦 登录/注册模式切换按钮
    // ===============================

    let isLoginMode = true;
    document.getElementById('toggle-login-register').onclick = function() {
        // 🌀 一键切换登录/注册模式
        isLoginMode = !isLoginMode;
        document.getElementById('login-form').style.display = isLoginMode ? '' : 'none';
        document.getElementById('register-form').style.display = isLoginMode ? 'none' : '';
        document.getElementById('login-register-title').textContent = isLoginMode ? '登录你的快乐账号' : '注册新账号';
        this.textContent = isLoginMode ? '没有地址？获取一个➡️' : '⬅️已有地址？登录';
    };
    // ===============================
    // 🔑 登录按钮事件（钱包式签名登录）
    // ===============================
    document.querySelector('#login-form button').onclick = async function(e) {
        e.preventDefault();
        // 🚨 检查输入
        const address = document.querySelector('#login-form input[type="text"]').value.trim();
        const privateKey = document.querySelector('#login-form input[type="password"]').value.trim();
        if (!address || !privateKey) {
            showToast('请输入地址和私钥');
            return;
        }
        // 1️⃣ 获取 challenge
        let challenge;
        try {
            const res = await fetch(`/login-challenge?address=${encodeURIComponent(address)}`);
            const data = await res.json();
            challenge = data.challenge;
        } catch {
            showToast('无法连接后端');
            return;
        }
        // 2️⃣ 用私钥签名 challenge
        try {
            const ec = new window.elliptic.ec('secp256k1');
            const key = ec.keyFromPrivate(privateKey, 'hex');
            const signature = key.sign(challenge).toDER('hex');
            // 3️⃣ 发送到后端验证
            const verifyRes = await fetch('/login-verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address, signature, challenge })
            });
            const result = await verifyRes.json();
            if (result.success) {
                showToast('登录成功');
                document.getElementById('login-breath-modal').style.display = 'none';
                document.getElementById('login-form').style.display = 'none';
                document.getElementById('register-form').style.display = 'none';
                document.getElementById('user-info').style.display = '';
                document.getElementById('user-address').textContent = address;
                document.getElementById('login-register-title').style.display = 'none';
                document.getElementById('toggle-login-register').style.display = 'none';
                document.getElementById('login-key-icon').style.display = 'none';
                // 保存登录状态
                localStorage.setItem('happy_login_address', address);
                window.currentUserAddress = address;
                updateHappyChainCoin(address);
            } else {
                showToast('登录失败，请检查密钥');
            }
        } catch {
            showToast('签名或验证失败');
        }
    };
    // 退出按钮事件
    document.getElementById('login-register-content').addEventListener('click', function(e) {
        if (e.target && e.target.id === 'logout-btn') {
            // 👋 退出登录，恢复初始界面
            document.getElementById('user-info').style.display = 'none';
            document.getElementById('login-form').style.display = '';
            document.getElementById('register-form').style.display = 'none';
            document.getElementById('login-register-title').style.display = '';
            document.getElementById('toggle-login-register').style.display = '';
            document.getElementById('login-key-icon').style.display = '';
            localStorage.removeItem('happy_login_address');
            window.currentUserAddress = undefined;
            showToast('已退出登录');
        }
    });
    // 封装生成密钥对的函数
    function generateKeyPairAndFill() {
        if (window.elliptic) {
            const ec = new window.elliptic.ec('secp256k1');
            const key = ec.genKeyPair();
            const privateKey = key.getPrivate('hex');
            const publicKey = key.getPublic('hex');
            window.crypto.subtle.digest('SHA-256', new Uint8Array(publicKey.match(/.{2}/g).map(b=>parseInt(b,16))))
                .then(async buf => {
                    const addr = Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
                    const address = 'HAPPY' + addr.slice(0, 40);
                    document.getElementById('happy-address').value = address;
                    document.getElementById('happy-private').value = privateKey;
                    showToast('新密钥对已生成');
                    try {
                        await fetch('/register-keypair', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                address: address,
                                publicKey: publicKey
                            })
                        });
                    } catch (e) {
                        showToast('密钥写入后端失败');
                    }
                });
        }
    }
    // ===============================
    // 🛠️ 注册密钥对按钮事件
    // ===============================
    document.getElementById('register-btn').onclick = function(e) {
        e.preventDefault();
        generateKeyPairAndFill();
    };
    document.addEventListener('click', function(e) {
        if (e.target.id === 'copy-address') {
            navigator.clipboard.writeText(document.getElementById('happy-address').value);
            showToast('地址已复制');
        }
        if (e.target.id === 'copy-private') {
            navigator.clipboard.writeText(document.getElementById('happy-private').value);
            showToast('私钥已复制');
        }
    });
}

// 唤起登录弹窗
document.getElementById('login-breath-btn').onclick = function(e) {
    e.stopPropagation();
    document.getElementById('login-breath-modal').style.display = 'flex';
};
// 关闭登录弹窗
document.getElementById('login-breath-modal').addEventListener('click', function(e) {
    if (e.target === this) this.style.display = 'none';
});
document.getElementById('close-login-breath').onclick = function() {
    document.getElementById('login-breath-modal').style.display = 'none';
};
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('login-breath-modal');
        if (modal) modal.style.display = 'none';
    }
});

async function updateHappyChainCoin(address) {
    try {
        const res = await fetch(`/user/info?address=${encodeURIComponent(address)}`);
        const data = await res.json();
        if (data.success && data.coins) {
            // 渲染币种列表
            const list = Object.entries(data.coins)
                .map(([k, v]) => `<div style="color:#e67e22;font-size:1.05rem;">${k.replace(/Coins?$/i,'币')}: ${v.length}</div>`)
                .join('');
            document.getElementById('user-coins-list').innerHTML = list || '<div style="color:#888;">暂无币</div>';
        } else {
            document.getElementById('user-coins-list').innerHTML = '<div style="color:#888;">暂无币</div>';
        }
    } catch {
        document.getElementById('user-coins-list').innerHTML = '<div style="color:#888;">暂无币</div>';
    }
}
// 显示发送弹窗
document.getElementById('transfer-btn').onclick = function() {
    document.getElementById('transfer-modal').style.display = 'flex';
};
// 取消
document.getElementById('transfer-cancel').onclick = function() {
    document.getElementById('transfer-modal').style.display = 'none';
};
// 确认发送
document.getElementById('transfer-confirm').onclick = async function() {
    const to = document.getElementById('transfer-address').value.trim();
    const amount = parseInt(document.getElementById('transfer-amount').value, 10);
    const coinType = document.getElementById('transfer-coin-type').getAttribute('data-type') || 'happyCoins';
    if (!to || !amount || amount < 1) {
        showToast('请输入正确的地址和数量');
        return;
    }
    const res = await fetch('/user/transfer-happychain-coin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            from: window.currentUserAddress,
            to,
            amount,
            coinType
        })
    });
    const data = await res.json();
    if (data.success) {
        showToast('发送成功');
        document.getElementById('transfer-modal').style.display = 'none';
        updateHappyChainCoin(window.currentUserAddress); // 刷新余额
    } else {
        showToast(data.msg || '发送失败');
    }
};
document.getElementById('close-transfer').onclick = function() {
    document.getElementById('transfer-modal').style.display = 'none';
};
document.getElementById('transfer-modal').addEventListener('click', function(e) {
    if (e.target === this) this.style.display = 'none';
});

// 打开币种选择弹窗
document.getElementById('transfer-coin-type').onclick = function() {
    document.getElementById('coin-select-modal').style.display = 'flex';
};
// 关闭币种选择弹窗
document.getElementById('close-coin-select').onclick = function() {
    document.getElementById('coin-select-modal').style.display = 'none';
};
// 选择币种
document.querySelectorAll('.coin-option').forEach(btn => {
    btn.onclick = function() {
        const type = this.getAttribute('data-type');
        const name = this.textContent;
        document.getElementById('transfer-coin-type').value = name;
        document.getElementById('transfer-coin-type').setAttribute('data-type', type);
        document.getElementById('coin-select-modal').style.display = 'none';
    };
});