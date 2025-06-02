// 轻量化小弹窗提示函数
function showToast(msg) {
    let toast = document.getElementById('light-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'light-toast';
        toast.style.position = 'fixed';
        toast.style.top = '40px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.background = 'rgba(255,255,255,0.98)';
        toast.style.color = 'var(--primary)';
        toast.style.fontWeight = 'bold';
        toast.style.fontSize = '1.1rem';
        toast.style.padding = '10px 28px';
        toast.style.borderRadius = '22px';
        toast.style.boxShadow = '0 4px 18px rgba(149,157,165,0.13)';
        toast.style.zIndex = '9999999';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    setTimeout(()=>{ toast.style.opacity = '0'; }, 1200);
}