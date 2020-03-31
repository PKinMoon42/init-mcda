const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// URL of the backend
const apiUrl = 'http://192.168.0.110:5000';

// User credentials
const admin = {
  email: 'admin@helision.com',
  password: '9876'
};

const user = {
  email: 'peti@peti.hu',
  password: '123123'
};

// Starting data
const projects = [
  {
    name: 'Metro Project',
    domain: 'GENERAL',
    archived: false,
    imagePath: '/assets/future1.jpg'
  },
  {
    name: 'City Project',
    domain: 'CITY_PLANNING',
    archived: false,
    imagePath: '/assets/future2.jpg'
  }
];

// And let's do it!
async function login(email, password) {
  try {
    const loginResponse = await axios.post(`${apiUrl}/login`, { email, password });
    const { token } = loginResponse.data;
    console.log('[+] Logged in as ' + email);
    return token;
  }
  catch (e) {
    console.log('[-] ERROR at login() with data: %s, %s', email, password);
    console.log(e.response);
  }
}

async function createUser(email) {
  try {
    const token = await login(admin.email, admin.password);
    const createUserResponse = await axios.post(`${apiUrl}/accounts`, { email }, { headers: { 'Authorization': `Bearer ${token}` }});
    console.log('[+] User created: ' + email);
    return createUserResponse.data;
  }
  catch (e) {
    console.log('[-] ERROR at createUser() with data: %s', email);
    console.log(e.response);
  }
}

async function resetPassword(accountId, password, passwordResetTokenId) {
  try {
    await axios.post(`${apiUrl}/accounts/passwordReset`, { accountId, password, passwordResetTokenId});
    console.log('[+] Password reset for user');
  }
  catch (e) {
    console.log('[-] ERROR at resetPassword() with data: %s, %s, %s', accountId, password, passwordResetTokenId);
    console.log(e.response);
  }
}

async function uploadCoverImage(imagePath, token) {
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(__dirname + imagePath));
    const uploadResponse = await axios.post(`${apiUrl}/projectCovers`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
        ...formData.getHeaders()
      }
    });
    const { path } = uploadResponse.data;
    console.log('[+] Uploaded image: ' + imagePath);
    return path;
  } catch (e) {
    console.log('[-] ERROR at uploadCoverImage() with data: %s', imagePath);
    console.log(e.response);
  }
}

async function createProject(project, token) {
  try {
    const coverImage = await uploadCoverImage(project.imagePath, token);
    const data = {
      ...project,
      coverImage
    };
    await axios.post(`${apiUrl}/projects`, data, { headers: { 'Authorization': `Bearer ${token}` }});
    console.log('[+] Project created: ' + project.name);
  }
  catch (e) {
    console.log('[-] ERROR at createProject() with data: %s', project.name);
    console.log(e.response);
  }
}


(async function() {

  const { id: accountId, passwordResetTokenID } = await createUser(user.email);

  await resetPassword(accountId, user.password, passwordResetTokenID);

  const token = await login(user.email, user.password);

  projects.forEach(async project => await createProject(project, token));

})();
