const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // 或指定你的前端域名
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200); // 处理预检请求
  }
  next();
});


// 获取所有帖子
app.get('/posts.json', (req, res) => {
  fs.readFile(path.join(__dirname, 'posts.json'), (err, data) => {
    if (err) return res.status(500).send('读取失败');
    res.type('json').send(data);
  });
});

// 获取所有帖子（兼容 /posts 路由，返回 posts.json 内容）
app.get('/posts', (req, res) => {
  fs.readFile(path.join(__dirname, 'posts.json'), (err, data) => {
    if (err) return res.status(500).send('读取失败');
    res.type('json').send(data);
  });
});

// 新增帖子
app.post('/posts', (req, res) => {
  const post = req.body;
  fs.readFile(path.join(__dirname, 'posts.json'), (err, data) => {
    let posts = [];
    if (!err) {
      try {
        posts = JSON.parse(data);
      } catch {
        posts = [];
      }
    }
    posts.unshift(post);
    fs.writeFile(path.join(__dirname, 'posts.json'), JSON.stringify(posts, null, 2), err => {
      if (err) return res.status(500).send('写入失败');
      res.json({ success: true });
    });
  });
});

// 新增：点赞接口
app.post('/posts/like', (req, res) => {
  const { title, username, time } = req.body;
  fs.readFile(path.join(__dirname, 'posts.json'), (err, data) => {
    if (err) return res.status(500).send('读取失败');
    let posts = [];
    try {
      posts = JSON.parse(data);
    } catch {
      posts = [];
    }
    let found = false;
    for (let post of posts) {
      if (post.title === title && post.username === username && post.time === time) {
        post.likes = (post.likes || 0) + 1;
        found = true;
        break;
      }
    }
    if (!found) return res.status(404).send('未找到帖子');
    fs.writeFile(path.join(__dirname, 'posts.json'), JSON.stringify(posts, null, 2), err => {
      if (err) return res.status(500).send('写入失败');
      res.json({ success: true });
    });
  });
});

// 新增：评论接口
app.post('/posts/comment', (req, res) => {
  const { title, username, time, comment } = req.body;
  fs.readFile(path.join(__dirname, 'posts.json'), (err, data) => {
    if (err) return res.status(500).send('读取失败');
    let posts = [];
    try {
      posts = JSON.parse(data);
    } catch {
      posts = [];
    }
    let found = false;
    for (let post of posts) {
      if (post.title === title && post.username === username && post.time === time) {
        if (!Array.isArray(post.comments)) post.comments = [];
        post.comments.push(comment);
        found = true;
        break;
      }
    }
    if (!found) return res.status(404).send('未找到帖子');
    fs.writeFile(path.join(__dirname, 'posts.json'), JSON.stringify(posts, null, 2), err => {
      if (err) return res.status(500).send('写入失败');
      res.json({ success: true });
    });
  });
});
app.post('/register-keypair', (req, res) => {
  const { address, publicKey } = req.body;
  if (!address || !publicKey) return res.status(400).json({ success: false, msg: '参数缺失' });

  const keyFile = path.join(__dirname, 'keypairs.json');
  let keypairs = [];
  if (fs.existsSync(keyFile)) {
    try {
      keypairs = JSON.parse(fs.readFileSync(keyFile));
    } catch {
      keypairs = [];
    }
  }
  // 检查是否已存在该地址
  const idx = keypairs.findIndex(k => k.address === address);
  if (idx >= 0) {
    keypairs[idx].publicKey = publicKey; // 更新公钥
  } else {
    keypairs.push({ address, publicKey });
  }
  fs.writeFile(keyFile, JSON.stringify(keypairs, null, 2), err => {
    if (err) return res.status(500).json({ success: false, msg: '写入失败' });
    res.json({ success: true });
  });
});
// 用于存储每个地址的 challenge
const challenges = {};

// 登录 challenge 下发接口
app.get('/login-challenge', (req, res) => {
  const { address } = req.query;
  if (!address) return res.status(400).json({ success: false, msg: '缺少地址' });
  // 生成随机 challenge
  const challenge = Math.random().toString(36).slice(2) + Date.now();
  challenges[address] = challenge;
  res.json({ challenge });
});

// 登录验证接口
const { ec: EC } = require('elliptic');
const ec = new EC('secp256k1');

app.post('/login-verify', (req, res) => {
  const { address, signature, challenge } = req.body;
  if (!address || !signature || !challenge) return res.json({ success: false });
  // 读取公钥
  const keyFile = path.join(__dirname, 'keypairs.json');
  if (!fs.existsSync(keyFile)) return res.json({ success: false });
  const keypairs = JSON.parse(fs.readFileSync(keyFile));
  const user = keypairs.find(k => k.address === address);
  if (!user || challenges[address] !== challenge) return res.json({ success: false });
  // 验证签名
  try {
    const pubKey = ec.keyFromPublic(user.publicKey, 'hex');
    const ok = pubKey.verify(challenge, signature);
    if (ok) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch {
    res.json({ success: false });
  }
});
app.use(express.static('.'));
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
