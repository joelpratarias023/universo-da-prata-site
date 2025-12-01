// admin.js

// --------------------
// Controle de seções
// --------------------
function mostrarSecao(id) {
  document.querySelectorAll('.secao').forEach(secao => {
    secao.classList.remove('ativo');
  });
  const alvo = document.getElementById(id);
  if (alvo) alvo.classList.add('ativo');
}

// --------------------
// Firebase Firestore
// --------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAWvp0-a_wijYgRzNIRrWBAq7Rg5gRpbdg",
  authDomain: "universo-da-prata.firebaseapp.com",
  projectId: "universo-da-prata",
  storageBucket: "universo-da-prata.firebasestorage.app",
  messagingSenderId: "673499740567",
  appId: "1:673499740567:web:cefdb71350e2e3def7acd2"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --------------------
// Buscar dados reais
// --------------------
async function contarUsuarios() {
  const querySnapshot = await getDocs(collection(db, "Teste User"));
  document.getElementById("totalUsuarios").textContent = querySnapshot.size;
}

async function carregarUsuarios() {
  const tabela = document.getElementById("tabela-usuarios");
  tabela.innerHTML = "<tr><th>Nome</th><th>Email</th></tr>";

  const querySnapshot = await getDocs(collection(db, "Teste user"));
  querySnapshot.forEach(doc => {
    const dados = doc.data();
    tabela.innerHTML += `
      <tr>
        <td>${dados.nome || ""}</td>
        <td>${dados.email || ""}</td>
      </tr>
    `;
  });
}

// --------------------
// Inicialização
// --------------------
carregarUsuarios();
