// 分享按钮事件绑定
function enableShareBtn(posts) {
    document.querySelectorAll('.fa-share').forEach((btn, idx) => {
        btn.parentElement.onclick = function(e) {
            e.stopPropagation();
            const post = posts[idx];
            showShareModal(post);
        };
    });
}

// 分享弹窗逻辑
function showShareModal(post) {
    const modal = document.getElementById('share-modal');
    const link = location.origin + location.pathname + `#${encodeURIComponent(post.title)}_${encodeURIComponent(post.username)}_${encodeURIComponent(post.time)}`;
    document.getElementById('share-link').textContent = link;
    modal.style.display = 'flex';
    document.getElementById('copy-link-btn').onclick = function() {
        navigator.clipboard.writeText(link);
        showToast('链接已复制');
    };
    document.getElementById('share-wechat-btn').onclick = function() {
        window.open(`https://wx.qq.com/?url=${encodeURIComponent(link)}`);
    };
    document.getElementById('share-qq-btn').onclick = function() {
        window.open(`https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(link)}&title=${encodeURIComponent(post.title)}`);
    };
    document.getElementById('share-weibo-btn').onclick = function() {
        window.open(`https://service.weibo.com/share/share.php?url=${encodeURIComponent(link)}&title=${encodeURIComponent(post.title)}`);
    };
    document.getElementById('close-share').onclick = function() {
        modal.style.display = 'none';
    };
    // 点击遮罩关闭
    modal.onclick = function(e) {
        if (e.target === modal) modal.style.display = 'none';
    };
    // ESC关闭
    document.addEventListener('keydown', function escClose(e) {
        if (e.key === 'Escape') {
            modal.style.display = 'none';
            document.removeEventListener('keydown', escClose);
        }
    });
}