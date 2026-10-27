require('dotenv').config();
const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// [API] 1. 큐카드 전체 조회
app.get('/api/cuecards', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cuecards')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// [API] 2. 새 큐카드 추가
app.post('/api/cuecards', async (req, res) => {
  try {
    const { title, v1, v2, v4, v5, v6, v7 } = req.body;
    
    // 필수 데이터 유효성 검사
    if (!title || !v1 || !v2 || !v4 || !v5 || !v6 || !v7) {
      return res.status(400).json({ error: ' 모든 필드를 입력해주세요.' });
    }

    const { data, error } = await supabase
      .from('cuecards')
      .insert([{ title, v1, v2, v4, v5, v6, v7 }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// [API] 3. 큐카드 삭제
app.delete('/api/cuecards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('cuecards')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: '성공적으로 삭제되었습니다.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 페이지 라우팅
app.get('/add', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'add.html'));
});

app.get('/del', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'del.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});
