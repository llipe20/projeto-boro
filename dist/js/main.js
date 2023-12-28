"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const ancora = document.getElementById('ancora-conta');
const title = document.getElementById('title-principal');
const ancoraEsq = document.getElementById('ancora-senha');
const btn = document.getElementById('btn-entrar');
const boxNome = document.getElementById('box-nome');
const form = document.getElementById('form');
// Show modal
function ShowModal(text, bg) {
    const boxModal = document.getElementById('box-modal');
    const content = document.getElementById('text-modal');
    boxModal.classList.remove('hidden');
    boxModal.classList.add(`${bg}`);
    content.textContent = text;
    setTimeout(() => {
        boxModal.classList.add('hidden');
        boxModal.classList.remove(`${bg}`);
        content.textContent = '';
    }, 2000);
}
// Altera o formulário entre Login e novo usuário
function AlterForm(isLogin) {
    if (!isLogin) { // Login
        ancora.classList.add('hidden');
        ancoraEsq.classList.add('hidden');
        boxNome.classList.remove('hidden');
        title.innerText = 'Nova Conta';
        btn.value = 'Criar conta';
    }
    else { // Criar user
        ancora.classList.remove('hidden');
        ancoraEsq.classList.remove('hidden');
        boxNome.classList.add('hidden');
        title.innerText = 'Faça login';
        btn.value = 'Entrar';
        btn.classList.add('pt-2', 'pb-2');
    }
}
// Evento de âncora: Mudar formulário para criar ou logar
ancora.addEventListener("click", () => {
    AlterForm(false);
});
function GetUsers(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const req = yield fetch('http://localhost:3000/users');
        const res = yield req.json();
        let user = res.find(user => user.email == email);
        if (!user) {
            user = { email: '', nome: '', senha: '' }; // Caso não encontre um user
        }
        return Promise.resolve(user);
    });
}
// Requisiçãp para add usuários
function AddUsers(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const req = yield fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return yield req.json();
    });
}
// ENVIO DE FORMULÁRIO
form.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    // Pegando dados do formulário
    let inputNome = document.getElementById('nome');
    let inputEmail = document.getElementById('email');
    let inputSenha = document.getElementById('senha');
    const user = {
        nome: inputNome.value,
        email: inputEmail.value,
        senha: inputSenha.value
    };
    // Login
    if (user.nome == '' || user.nome == null) {
        try {
            if (user.email == '' || user.senha == '') {
                ShowModal('Preencha os campos', 'bg-red-800');
            }
            else {
                const userJson = yield GetUsers(user.email);
                if (userJson.senha == null || user.senha === '') {
                    ShowModal('Usuário Inexistente', 'bg-red-800');
                }
                else {
                    if (userJson.senha === user.senha) {
                        // Modal de login de sucesso aqui
                        ShowModal('Login com SUCESSO!', 'bg-lime-600');
                        window.open('');
                    }
                    else {
                        ShowModal('Senha incorreta!', 'bg-red-800');
                    }
                }
            }
        }
        catch (error) {
            console.error('Erro ao obter usuários:', error);
        }
    }
    else {
        // Nova conta
        try {
            if (user.email == '' || user.senha == '') { // verificar se os campos estão vazios
                ShowModal('Preencha os campos', 'bg-red-800');
            }
            else {
                const userJson2 = yield GetUsers(user.email); // verificar se o user já existe
                if (userJson2.email !== '') {
                    ShowModal('Usuário existente!', 'bg-red-800');
                }
                else {
                    const res = yield AddUsers(user);
                    if (res) {
                        ShowModal('Criado com SUCESSO!', 'bg-lime-600');
                        AlterForm(true);
                    }
                    else {
                        ShowModal('Erro ao criar usuário', 'bg-red-800');
                    }
                }
            }
        }
        catch (error) {
            console.error('Erro ao adicionar usuários:', error);
        }
    }
    // Limpando os inputs
    inputNome.value = '';
    inputEmail.value = '';
    inputSenha.value = '';
}));
