// 只展示有该tag的帖子
function filterPostsByChannel(channelName) {
    const tags = channelTagMap[channelName] || [];
    document.querySelectorAll('.post-card').forEach(card => {
        let matched = false;
        // 检查帖子时间栏和tag栏
        const postTime = card.querySelector('.post-time')?.textContent || '';
        const postTags = Array.from(card.querySelectorAll('.tag')).map(t=>t.textContent);
        for (let tag of tags) {
            if (postTime.includes(tag.replace('#','')) || postTags.includes(tag)) {
                matched = true;
                break;
            }
        }
        card.style.display = matched || channelName==='今日快乐' ? '' : 'none';
    });
}
// 页面加载默认显示全部
filterPostsByChannel('今日快乐');
// 侧边栏帖子预览点击跳转到主内容区对应帖子
function scrollToPost(tag) {
    // 通过帖子标题或频道名定位帖子
    const postTitles = document.querySelectorAll('.post-title');
    for (let title of postTitles) {
        if (title.textContent.includes(tag) || title.parentElement.parentElement.querySelector('.post-time')?.textContent.includes(tag)) {
            title.scrollIntoView({behavior: 'smooth', block: 'center'});
            title.parentElement.parentElement.classList.add('highlight-post');
            setTimeout(()=>{
                title.parentElement.parentElement.classList.remove('highlight-post');
            }, 1200);
            break;
        }
    }
}
// 收集所有帖子中出现过的标签
function getAllTags() {
    const tagSet = new Set();
    document.querySelectorAll('.post-card .tag').forEach(tagEl => {
        tagSet.add(tagEl.textContent.trim());
    });
    return Array.from(tagSet);
}

// 渲染标签选择栏
function renderTagFilterBar() {
    const tagBar = document.getElementById('tag-filter-bar');
    tagBar.innerHTML = '';
    const allTags = getAllTags();
    allTags.forEach(tag => {
        const tagBtn = document.createElement('span');
        tagBtn.className = 'filter-tag';
        tagBtn.textContent = tag;
        tagBtn.onclick = () => {
            if (selectedTags.includes(tag)) {
                removeTag(tag);
            } else {
                selectTag(tag);
            }
        };
        tagBar.appendChild(tagBtn);
    });
}
// 新建帖子弹窗下方添加可选标签栏
const newPostContent = document.getElementById('new-post-content');
if (!document.getElementById('tag-suggestion-bar')) {
    const tagBar = document.createElement('div');
    tagBar.id = 'tag-suggestion-bar';
    tagBar.style.display = 'flex';
    tagBar.style.flexWrap = 'wrap';
    tagBar.style.gap = '8px';
    tagBar.style.margin = '8px 0 12px 0';
    newPostContent.insertBefore(tagBar, document.getElementById('new-post-form').nextSibling);
}

function renderTagSuggestionBar() {
    const tagBar = document.getElementById('tag-suggestion-bar');
    tagBar.innerHTML = '';
    // 收集所有已有tag
    const tagSet = new Set();
    document.querySelectorAll('.post-card .tag').forEach(tagEl => {
        tagSet.add(tagEl.textContent.trim());
    });
    const allTags = Array.from(tagSet);
    allTags.forEach(tag => {
        const tagBtn = document.createElement('span');
        tagBtn.className = 'filter-tag';
        tagBtn.textContent = tag;
        tagBtn.style.cursor = 'pointer';
        tagBtn.onclick = function() {
            const tagInput = document.getElementById('new-tags');
            let val = tagInput.value;
            if (!val.includes(tag)) {
                if (!val.endsWith(' ') && val.length > 0) val += ' ';
                tagInput.value = val + tag;
            }
            tagInput.focus();
        };
        tagBar.appendChild(tagBtn);
    });
}
// 新建帖子弹窗每次打开时刷新可选标签
openBtn.addEventListener('click', function() {
    renderTagSuggestionBar();
});

// 帖子内标签点击筛选/取消
function enablePostTagClick() {
    document.querySelectorAll('.post-card .tag').forEach(tagEl => {
        tagEl.style.cursor = 'pointer';
        tagEl.onclick = function(e) {
            e.stopPropagation();
            const tag = tagEl.textContent.trim();
            if (selectedTags.includes(tag)) {
                removeTag(tag);
            } else {
                selectTag(tag);
            }
        };
    });
}
// 选中标签管理
let selectedTags = [];
function selectTag(tag) {
    if (!selectedTags.includes(tag)) {
        selectedTags.push(tag);
        renderSelectedTags();
        filterPostsByTags();
    }
}
function removeTag(tag) {
    selectedTags = selectedTags.filter(t => t !== tag);
    renderSelectedTags();
    filterPostsByTags();
}
// 渲染已选标签栏
function renderSelectedTags() {
    const selectedBar = document.getElementById('selected-tags');
    selectedBar.innerHTML = '';
    selectedTags.forEach(tag => {
        const tagEl = document.createElement('span');
        tagEl.className = 'selected-tag';
        tagEl.innerHTML = `${tag}<span class="remove-tag">&times;</span>`;
        tagEl.querySelector('.remove-tag').onclick = () => removeTag(tag);
        selectedBar.appendChild(tagEl);
    });
    // 高亮已选标签
    document.querySelectorAll('.filter-tag').forEach(el => {
        if (selectedTags.includes(el.textContent.trim())) {
            el.classList.add('selected');
        } else {
            el.classList.remove('selected');
        }
    });
    // 高亮帖子内已选标签
    document.querySelectorAll('.post-card .tag').forEach(tagEl => {
        if (selectedTags.includes(tagEl.textContent.trim())) {
            tagEl.style.background = 'var(--primary)';
            tagEl.style.color = '#fff';
        } else {
            tagEl.style.background = '';
            tagEl.style.color = '';
        }
    });
}
// 根据已选标签筛选帖子
function filterPostsByTags() {
    document.querySelectorAll('.post-card').forEach(card => {
        const postTags = Array.from(card.querySelectorAll('.tag')).map(t=>t.textContent.trim());
        // 所有已选标签都要包含
        const matched = selectedTags.every(tag => postTags.includes(tag));
        card.style.display = (selectedTags.length === 0 || matched) ? '' : 'none';
    });
}
// 初始化标签栏
renderTagFilterBar();
renderSelectedTags();
enablePostTagClick();
// 在频道切换和搜索时清空标签筛选
function clearTagFilter() {
    selectedTags = [];
    renderSelectedTags();
    filterPostsByTags();
}
// 修改频道切换和搜索逻辑
document.querySelectorAll('.channel').forEach(channel => {
    channel.addEventListener('click', function() {
        document.querySelector('.channel.active').classList.remove('active');
        this.classList.add('active');
        clearTagFilter();
        const channelName = this.dataset.channel || this.innerText.trim();
        filterPostsByChannel(channelName);
    });
});
// 搜索时清空标签
searchInput.addEventListener('input', function() {
    const keyword = this.value.trim().toLowerCase();
    if (!keyword) {
        clearTagFilter();
        const activeChannel = document.querySelector('.channel.active');
        filterPostsByChannel(activeChannel ? activeChannel.innerText.trim() : '今日快乐');
        return;
    }
    clearTagFilter();
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