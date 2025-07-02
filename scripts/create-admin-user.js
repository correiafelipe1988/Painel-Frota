// Script para criar usuário administrativo
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, updateProfile } = require('firebase/auth');

// Configuração do Firebase (mesma do projeto)
const firebaseConfig = {
  apiKey: "AIzaSyDz7Ubrlqz4gzJhHjN5AdAD_AHlDtWZtVg",
  authDomain: "painel-locagora-master.firebaseapp.com",
  projectId: "painel-locagora-master",
  storageBucket: "painel-locagora-master.appspot.com",
  messagingSenderId: "664268338205",
  appId: "1:664268338205:web:0b8fdbc5a0c47f0bb882f4"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function createAdminUser() {
  try {
    console.log('Criando usuário administrativo...');
    
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      'admin@masterportoalegre.com', 
      'admin123456'
    );
    
    await updateProfile(userCredential.user, {
      displayName: 'Administrador Master Porto Alegre'
    });
    
    console.log('✅ Usuário administrativo criado com sucesso!');
    console.log('📧 Email: admin@masterportoalegre.com');
    console.log('🔑 Senha: admin123456');
    console.log('👤 Nome: Administrador Master Porto Alegre');
    
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error.message);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️  O usuário já existe. Use as credenciais:');
      console.log('📧 Email: admin@masterportoalegre.com');
      console.log('🔑 Senha: admin123456');
    }
  }
  
  process.exit(0);
}

createAdminUser();