// 新帖子按钮动画
const newPostBtn = document.querySelector('.new-post-btn');
newPostBtn.addEventListener('click', function() {
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    setTimeout(() => {
        this.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-plus"></i>';
        }, 1500);
    }, 1000);
});

// 新建帖子弹窗交互
const modal = document.getElementById('new-post-modal');
const openBtn = document.querySelector('.new-post-btn');
const closeBtn = document.getElementById('close-new-post');
openBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    modal.style.display = 'flex';
    setTimeout(()=>{
        document.getElementById('new-username').focus();
    }, 200);
});
closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
});
modal.addEventListener('click', function(e) {
    if(e.target === modal) modal.style.display = 'none';
});
// ESC关闭
document.addEventListener('keydown', function(e) {
    if(e.key === 'Escape') modal.style.display = 'none';
});
// 新建帖子表单提交
document.getElementById('new-post-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('new-username').value.trim() || '匿名';
    const title = document.getElementById('new-title').value.trim();
    const content = document.getElementById('new-content').value.trim();
    const linkAddress = document.getElementById('show-address-checkbox').checked;
    let tags = document.getElementById('new-tags').value.match(/#([^#\s]+)/g) || [];
    tags = tags.map(t=>t.trim());
    if(!title || !content) return;
    // 构造新帖子对象
    const newPost = {
        username,
        linkAddress,
        address: linkAddress ? window.currentUserAddress : '',
        avatar: username.slice(0,2).toUpperCase(),
        time: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) + ' · #' + (tags[0] ? tags[0].replace('#','') : '今日快乐'),
        title,
        text: content,
        tags,
        likes: 0,
        comments: 0
    };
    // 写入后端
    try {
        await fetch('/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPost)
        });
        // 重新加载帖子
        loadPostsFromJson();
    } catch (err) {
        alert('保存失败，请检查后端服务是否启动');
    }
    modal.style.display = 'none';
    this.reset();
    renderTagFilterBar();
    renderSelectedTags();
    enablePostTagClick();
});

function updateAddressCheckbox() {
    const address = window.currentUserAddress; // 假设登录后全局变量存地址
    const container = document.getElementById('address-checkbox-container');
    if (address) {
        container.style.display = 'inline-block';
    } else {
        container.style.display = 'none';
    }
}

// 新建弹窗打开时调用
document.querySelector('.new-post-btn').addEventListener('click', updateAddressCheckbox);