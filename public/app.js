// Calculate function
async function calculate() {
    const num1 = document.getElementById('num1').value;
    const num2 = document.getElementById('num2').value;
    const operation = document.getElementById('operation').value;

    try {
      const response = await fetch(`/arithmetic/${operation}/${num1}/${num2}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();  // JSON 응답 파싱
      console.log('Calculation result:', data);  // 콘솔에 결과 출력
  
      document.getElementById('calc-result').innerText = data.result;
    } catch (error) {
      console.error('Error fetching calculation result:', error);
      document.getElementById('calc-result').innerText = 'Error';
    }
  }
//////
// User Manager 관련 코드
// 사용자 목록 가져오기
async function fetchUsers() {
  try {
    const response = await fetch('/users');  // 백엔드에서 사용자 목록 가져오기
    const users = await response.json();
    renderUsers(users);  // 사용자 목록 렌더링
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

// 사용자 목록 렌더링 함수
function renderUsers(users) {
  const tbody = document.querySelector('#user-table tbody');
  tbody.innerHTML = '';  // 기존 목록 초기화

  users.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.userId}</td>
      <td><span>${user.trustScore}</span></td>
      <td>
        <button onclick="adjustTrust(${user.id}, 1)">+</button>
        <button onclick="adjustTrust(${user.id}, -1)">-</button>
        <button onclick="deleteUser(${user.id})">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// 사용자 저장 함수
async function saveUser() {
  const name = document.getElementById('userName').value;
  const userId = document.getElementById('userId').value;

  if (!name || !userId) {
    document.getElementById('user-message').innerText = 'Name and ID are required!';
    return;
  }

  try {
    const response = await fetch('/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, userId }),  // 사용자 데이터 전송
    });

    if (!response.ok) {
      const errorData = await response.json();
      document.getElementById('user-message').innerText = errorData.error;
      return;
    }

    document.getElementById('user-message').innerText = 'User saved successfully!';
    fetchUsers();  // 목록 갱신
  } catch (error) {
    console.error('Error saving user:', error);
  }
}

// 신뢰도 점수 조정 함수
async function adjustTrust(id, amount) {
  try {
    const response = await fetch(`/users/${id}/trust`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),  // 신뢰도 조정 데이터 전송
    });

    if (!response.ok) {
      throw new Error('Failed to update trust score');
    }

    fetchUsers();  // 목록 갱신
  } catch (error) {
    console.error('Error updating trust score:', error);
  }
}

// 사용자 삭제 함수
async function deleteUser(id) {
  try {
    const response = await fetch(`/users/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }

    fetchUsers();  // 목록 갱신
  } catch (error) {
    console.error('Error deleting user:', error);
  }
}

// 페이지 로드 시 사용자 목록 가져오기
document.addEventListener('DOMContentLoaded', fetchUsers);
