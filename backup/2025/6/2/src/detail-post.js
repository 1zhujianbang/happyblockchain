// 详细按钮事件
function enableDetailBtn(posts) {
    document.querySelectorAll('.detail-btn').forEach(btn => {
        btn.onclick = function(e) {
            e.stopPropagation();
            const idx = +btn.getAttribute('data-index');
            showDetailModal(posts[idx]);
        };
    });
}

function showDetailModal(post) {
    const modal = document.getElementById('post-detail-modal');
    const main = document.getElementById('detail-main');
    const comments = document.getElementById('detail-comments');
    main.innerHTML = `
        <div style="display:flex;align-items:center;gap:16px;">
            <div class="user-avatar" style="width:56px;height:56px;font-size:1.5rem;">${post.avatar}</div>
            <div>
                <div class="username" style="font-size:1.1rem;">
                    ${post.username}
                    ${post.showAddress && post.address ? `<span class="user-address" style="font-size:0.85em;color:#888;margin-left:6px;cursor:pointer;" title="点击复制">${post.address}</span>` : ''}
                </div>
                <div class="post-time" style="font-size:0.95rem;">${post.time}</div>
            </div>
        </div>
        <h2 style="margin:1.2rem 0 0.7rem;color:var(--primary);font-size:1.5rem;">${post.title}</h2>
        <div style="font-size:1.1rem;line-height:1.7;margin-bottom:1.2rem;">${post.text}</div>
        <div class="post-tags detail-tags" style="margin-bottom:1.2rem;">${(post.tags||[]).map(t=>`<span class='tag'>${t}</span>`).join('')}</div>
        <div class="post-stats detail-stats" style="margin-bottom:1.2rem;">
            <div class="stat like-btn-detail"><i class="far fa-heart"></i> <span>${post.likes}</span></div>
            <div class="stat"><i class="far fa-comment"></i> <span>${post.comments ? post.comments.length : 0}</span></div>
        </div>
    `;
    // 评论区
    comments.innerHTML = `<div style="color:var(--primary);font-weight:bold;margin-bottom:0.5rem;">评论区</div><div style="color:#aaa;">暂无评论，敬请期待~</div>`;
    modal.style.display = 'flex';

    // 详细弹窗内标签点击筛选
    main.querySelectorAll('.detail-tags .tag').forEach(tagEl => {
        tagEl.style.cursor = 'pointer';
        tagEl.onclick = function(e) {
            e.stopPropagation();
            const tag = tagEl.textContent.trim();
            if (selectedTags.includes(tag)) {
                removeTag(tag);
            } else {
                selectTag(tag);
            }
            // 关闭弹窗，聚焦主列表
            modal.style.display = 'none';
        };
    });

    // 详细弹窗点赞按钮逻辑
    const likeBtn = main.querySelector('.like-btn-detail');
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
            likeBtn.innerHTML = '<i class="fas fa-heart" style="color:#ff7eb9"></i> <span>' + num + '</span>';
            liked = true;
            localStorage.setItem(postKey, '1');
            showToast('感谢你的点赞！');
            // 写入后端
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
                // 主列表点赞数同步刷新
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
    // 评论区渲染和交互
    function renderComments(post) {
        const commentsDiv = document.getElementById('detail-comments');
        let html = `
            <div style="color:var(--primary);font-weight:bold;margin-bottom:0.5rem;">评论区</div>
            <div style="max-height: 25vh;overflow-y: auto; margin-bottom: 12px;">
        `;
        if (post.comments && post.comments.length > 0) {
            html += post.comments.map(c =>
                `   <div style="margin-bottom:8px;">
                        <b style="color:var(--primary);word-break: break-all;max-width: 100em;">${c.username}</b>：
                        <span style="display: inline-block; word-break: break-all; max-width: 100em;">${c.content} </span> 
                        <span style="color:#aaa;font-size:0.9em;">${c.time}</span>
                    </div>`
            ).join('');
        } else {
            html += `   <div style="color:#aaa;">暂无评论，快来抢沙发吧~</div>`;
        }
        html += `</div>`;
        html += `
            <div style="margin-top:12px;display:flex;gap:8px;">
                <input id="comment-username" type="text" placeholder="昵称" maxlength="12" style="flex:0 0 100px;min-width:45px;padding:6px 10px;border-radius:8px;border:1px solid #eee;">
                <input id="comment-input" type="text" placeholder="写下你的评论..." maxlength="100" style="flex:1;padding:6px 10px;min-width:140px;border-radius:8px;border:1px solid #eee;">
                <button id="comment-submit" style="background:var(--primary);color:#fff;border:none;border-radius:8px;padding:6px 18px;cursor:pointer;">评论</button>
            </div>
        `;
        commentsDiv.innerHTML = html;
        document.getElementById('comment-submit').onclick = async function() {
            const username = document.getElementById('comment-username').value.trim() || '匿名';
            const content = document.getElementById('comment-input').value.trim();
            if (!content) {
                showToast('评论不能为空');
                return;
            }
            try {
                await fetch('/posts/comment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: post.title,
                        username: post.username,
                        time: post.time,
                        comment: {
                            username,
                            content,
                            time: new Date().toLocaleString()
                        }
                    })
                    
                });
                showToast('评论成功！');
                loadPostsFromJson();
                setTimeout(() => {
                    fetch('posts.json').then(res=>res.json()).then(posts=>{
                        const p = posts.find(p=>p.title===post.title && p.username===post.username && p.time===post.time);
                        if (p) renderComments(p);
                    });
                }, 300);
            } catch (e) {
                showToast('评论失败');
            }
        };
    }
    renderComments(post);
    modal.style.display = 'flex';
}
// 关闭详细弹窗
if (!window._detailModalBind) {
    document.body.addEventListener('click', function(e) {
        const modal = document.getElementById('post-detail-modal');
        if (modal && e.target === modal) modal.style.display = 'none';
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('post-detail-modal');
            if (modal) modal.style.display = 'none';
        }
    });
    document.body.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'close-detail') {
            document.getElementById('post-detail-modal').style.display = 'none';
        }
    });
    window._detailModalBind = true;
}

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('user-address')) {
        navigator.clipboard.writeText(e.target.textContent);
        showToast('地址已复制');
    }
});