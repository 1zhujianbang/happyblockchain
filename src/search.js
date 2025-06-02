// 搜索功能：关键词模糊搜索帖子
const searchInput = document.querySelector('.search-box input');
searchInput.addEventListener('input', function() {
    const keyword = this.value.trim().toLowerCase();
    if (!keyword) {
        // 恢复当前频道筛选
        const activeChannel = document.querySelector('.channel.active');
        filterPostsByChannel(activeChannel ? activeChannel.innerText.trim() : '今日快乐');
        return;
    }
    document.querySelectorAll('.post-card').forEach(card => {
        const title = card.querySelector('.post-title')?.textContent.toLowerCase() || '';
        const text = card.querySelector('.post-text')?.textContent.toLowerCase() || '';
        const tags = Array.from(card.querySelectorAll('.tag')).map(t=>t.textContent.toLowerCase()).join(' ');
        const user = card.querySelector('.username')?.textContent.toLowerCase() || '';
        if (title.includes(keyword) || text.includes(keyword) || tags.includes(keyword) || user.includes(keyword)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
});