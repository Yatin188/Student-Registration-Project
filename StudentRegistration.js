// Utility for DOM selection
const $ = selector => document.querySelector(selector);

// DOM Elements
const form = $('#studentForm');
const tableBody = $('#studentTable tbody');

// Load existing records from localStorage
let students = JSON.parse(localStorage.getItem('students')) || [];
let editIndex = null;

// Utility: Save to localStorage
function saveToLocalStorage() {
  localStorage.setItem('students', JSON.stringify(students));
}

// Utility: Validate Inputs
function isValidStudent({ name, studentId, email, contact }) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return (
    name.match(/^[A-Za-z ]+$/) &&
    /^\d+$/.test(studentId) &&
    emailRegex.test(email) &&
    /^\d{10,}$/.test(contact)
  );
}

// Utility: Render Table
function renderTable() {
  tableBody.innerHTML = '';
  students.forEach((student, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.studentId}</td>
      <td>${student.email}</td>
      <td>${student.contact}</td>
      <td class="actions">
        <button class="edit" onclick="editStudent(${index})">Edit</button>
        <button class="delete" onclick="deleteStudent(${index})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Add or Edit Student
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const newStudent = {
    name: $('#name').value.trim(),
    studentId: $('#studentId').value.trim(),
    email: $('#email').value.trim(),
    contact: $('#contact').value.trim(),
  };

  if (!isValidStudent(newStudent)) {
    alert('Please enter valid data!');
    return;
  }

  if (editIndex !== null) {
    students[editIndex] = newStudent;
    editIndex = null;
  } else {
    students.push(newStudent);
  }

  saveToLocalStorage();
  renderTable();
  form.reset();
});

// Edit Student
window.editStudent = (index) => {
  const student = students[index];
  $('#name').value = student.name;
  $('#studentId').value = student.studentId;
  $('#email').value = student.email;
  $('#contact').value = student.contact;
  editIndex = index;
};

// Delete Student
window.deleteStudent = (index) => {
  if (confirm('Are you sure you want to delete this record?')) {
    students.splice(index, 1);
    saveToLocalStorage();
    renderTable();
  }
};

// Initial Render
renderTable();
