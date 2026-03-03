const express = require('express');
const db = require('../db/connection');

const users = db.get('user');
const jobs = db.get('job'); // 假设 jobs 集合存在

const router = express.Router();

// 中间件：添加请求到达时间的响应头
const requestTimeMiddleware = (req, res, next) => {
  req.requestTime = new Date().toISOString();
  res.setHeader('X-Request-Arrival-Time', req.requestTime);
  next();
};

// 应用中间件
router.use(requestTimeMiddleware);

// 1. 获取所有用户
router.get('/', async (req, res, next) => {
  try {
    const allUsers = await users.find({});
    res.json(allUsers);
  } catch (error) {
    next(error);
  }
});

// 2. 根据用户名获取用户
router.get('/username/:username', async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await users.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// 3. 根据 _id 获取用户
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await users.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// 4. 获取数据库中所有 jobs
router.get('/jobs/all', async (req, res, next) => {
  try {
    const allJobs = await jobs.find({});
    res.json(allJobs);
  } catch (error) {
    next(error);
  }
});

// 5. 获取 ID 在指定范围内的用户
router.get('/range/ids', async (req, res, next) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ message: 'Missing start or end query parameters' });
    }
    const usersInRange = await users.find({
      _id: { $gte: start, $lte: end }
    });
    res.json(usersInRange);
  } catch (error) {
    next(error);
  }
});

module.exports = router;