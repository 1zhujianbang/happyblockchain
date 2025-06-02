// 简单的交互效果
document.querySelectorAll('.post-card').forEach(card => {
    card.addEventListener('click', function() {
        this.classList.toggle('expanded');
    });
});

document.querySelectorAll('.stat').forEach(stat => {
    stat.addEventListener('click', function(e) {
        e.stopPropagation();
        if(this.querySelector('.fa-heart')) {
            this.classList.toggle('active');
            if(this.classList.contains('active')) {
                this.innerHTML = '<i class="fas fa-heart" style="color:#ff7eb9"></i> <span>已喜欢</span>';
            } else {
                const count = Math.floor(Math.random() * 50) + 100;
                this.innerHTML = '<i class="far fa-heart"></i> <span>'+count+'</span>';
            }
        }
    });
});
// 帖子卡片渲染函数
function createPostCard(post, index) {
    const card = document.createElement('div');
    card.className = 'post-card';
    card.innerHTML = `
        <div class="post-header">
            <div class="user-avatar">${post.avatar}</div>
            <div class="user-info">
                <div class="username">${post.username}</div>
                <div class="post-time">${post.time}</div>
            </div>
            <button class="detail-btn" data-index="${index}"> &gt;-详细-&lt; </button>
        </div>
        <div class="post-content">
            <h3 class="post-title">${post.title}</h3>
            <p class="post-text">${post.text}</p>
            <div class="post-tags">
                ${(post.tags||[]).map(t=>`<span class='tag'>${t}</span>`).join('')}
            </div>
        </div>
        <div class="post-stats">
            <div class="stat like-btn"><i class="far fa-heart"></i> <span>${post.likes}</span></div>
            <div class="stat"><i class="far fa-comment"></i> <span>${post.comments ? post.comments.length : 0}</span></div>
            <div class="stat"><i class="fas fa-share"></i> <span>分享</span></div>
        </div>
    `;
    // 事件绑定
    card.addEventListener('click', function() {
        this.classList.toggle('expanded');
    });
    // 点赞只能+1且不可取消，写入后端并本地记录
    const likeBtn = card.querySelector('.like-btn');
    const postKey = 'liked_' + (post.title + '_' + post.username + '_' + post.time).replace(/[^\w]/g, '');
    let liked = localStorage.getItem(postKey) === '1';
    if (liked) {
        likeBtn.innerHTML = '<i class="fas fa-heart" style="color:#ff7eb9"></i> <span>' + post.likes + '</span>';
    }
    likeBtn.addEventListener('click', async function(e) {
        e.stopPropagation();
        if (!liked) {
            let num = parseInt(likeBtn.querySelector('span').textContent) || 0;
            num++;
            likeBtn.querySelector('span').textContent = num;
            likeBtn.innerHTML = '<i class="fas fa-heart" style="color:#ff7eb9"></i> <span>' + num + '</span>';
            liked = true;
            localStorage.setItem(postKey, '1');
            showToast('感谢你的点赞！');
            // 写入后端（只更新该帖的likes）
            try {
                await fetch('/posts/like', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: post.title,
                        username: post.username,
                        time: post.time
                    })
                });
                loadPostsFromJson();
                if (post.address) {
                    // 有链接地址，通知后端给该地址加币
                    fetch('/user/add-happy-coin', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ address: post.address, amount: 1 })
                    });
                }
            } catch (err) {
                showToast('点赞写入后端失败');
            }
        } else {
            showToast('你已经点过赞啦！');
        }
    });
    card.querySelectorAll('.stat:not(.like-btn)').forEach(stat => {
        stat.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
    return card;
}
// 动态加载posts.json渲染帖子
async function loadPostsFromJson() {
    const grid = document.querySelector('.post-grid');
    grid.innerHTML = '';
    let posts = [];
    try {
        const res = await fetch('posts.json');
        posts = await res.json();
    } catch (e) {
        // 兼容本地file协议下fetch失败，降级为不加载
        return;
    }
    posts.forEach((post, idx) => {
        const card = createPostCard(post, idx);
        grid.appendChild(card);
    });
    renderTagFilterBar();
    renderSelectedTags();
    enablePostTagClick();
    enableDetailBtn(posts);
    enableShareBtn(posts);
}