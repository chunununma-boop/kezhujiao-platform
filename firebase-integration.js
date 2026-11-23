// Firebase 配置 - 请替换为你的项目配置
// 获取方式：Firebase Console → 项目设置 → 常规 → 你的应用 → Firebase SDK snippet → Config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Firebase 初始化
let db = null;
let firebaseReady = false;

async function initFirebase() {
  try {
    // 动态加载 Firebase SDK
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
    const { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, onSnapshot } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    firebaseReady = true;
    console.log('Firebase 已连接');
    return true;
  } catch (e) {
    console.warn('Firebase 初始化失败，使用本地存储:', e);
    return false;
  }
}

// 云端保存
async function cloudSave(collectionName, docId, data) {
  if (!firebaseReady || !db) return false;
  try {
    const { setDoc, doc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    await setDoc(doc(db, collectionName, docId), {
      ...data,
      updatedAt: new Date().toISOString(),
      _synced: true
    });
    return true;
  } catch (e) {
    console.warn('云端保存失败:', e);
    return false;
  }
}

// 云端读取
async function cloudLoad(collectionName, docId) {
  if (!firebaseReady || !db) return null;
  try {
    const { getDoc, doc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    const snapshot = await getDoc(doc(db, collectionName, docId));
    return snapshot.exists() ? snapshot.data() : null;
  } catch (e) {
    console.warn('云端读取失败:', e);
    return null;
  }
}

// 按班级 + 组号保存学生数据
async function saveStudentData(cls, groupNo, studentName, data) {
  const docId = `${cls}_${groupNo}_${studentName}`;
  return await cloudSave('students', docId, {
    class: cls,
    group: groupNo,
    student: studentName,
    data: data,
    lastActive: new Date().toISOString()
  });
}

// 教师端：获取某班某组的所有学生数据
async function loadGroupData(cls, groupNo) {
  if (!firebaseReady || !db) return [];
  try {
    const { collection, query, where, getDocs } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    const q = query(collection(db, 'students'), where('class', '==', cls), where('group', '==', groupNo));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => d.data());
  } catch (e) {
    console.warn('获取小组数据失败:', e);
    return [];
  }
}

// 启动时初始化
initFirebase();
