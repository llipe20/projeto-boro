const ancora = document.getElementById('ancora-conta') as HTMLAnchorElement 
const title = document.getElementById('title-principal') as HTMLHeadingElement
const ancoraEsq = document.getElementById('ancora-senha') as HTMLAnchorElement
const btn = document.getElementById('btn-entrar') as HTMLButtonElement
const boxNome = document.getElementById('box-nome') as HTMLDivElement 
const form = document.getElementById('form') as HTMLFormElement 

// Show modal
function ShowModal(text: string, bg: string) {
    const boxModal = document.getElementById('box-modal') as HTMLDivElement 
    const content = document.getElementById('text-modal') as HTMLSpanElement

    boxModal.classList.remove('hidden')
    boxModal.classList.add(`${bg}`)
    content.textContent = text

    setTimeout(() => {
        boxModal.classList.add('hidden')
        boxModal.classList.remove(`${bg}`)
        content.textContent = ''
    }, 2000)
}

// Altera o formulário entre Login e novo usuário
function AlterForm (isLogin: boolean) {
    if(!isLogin) {                           // Login
        ancora.classList.add('hidden')
        ancoraEsq.classList.add('hidden')
        boxNome.classList.remove('hidden')
        title.innerText = 'Nova Conta'
        btn.value = 'Criar conta'
    } else {                                // Criar user
        ancora.classList.remove('hidden')
        ancoraEsq.classList.remove('hidden')
        boxNome.classList.add('hidden')
        title.innerText = 'Faça login'
        btn.value = 'Entrar'
        btn.classList.add('pt-2', 'pb-2')
    }
}

// Evento de âncora: Mudar formulário para criar ou logar
ancora.addEventListener("click", () => {
    AlterForm(false)
})

// Requisição para pegar login
interface Usuario { 
    id?: number; 
    nome: string; 
    email: string;
    senha : string;
 }

async function GetUsers (email: string) :  Promise<Usuario> {
    const req: Response = await fetch('http://localhost:3000/users')
    const res: Usuario[] = await req.json()
    let user: Usuario | undefined = res.find(user => user.email == email)
    if (!user) {
        user = {email : '', nome: '', senha: ''} // Caso não encontre um user
    }
    return Promise.resolve(user)
}

// Requisiçãp para add usuários
async function AddUsers (data: object) : Promise<object> {
    const req: Response = await fetch('http://localhost:3000/users', {
        method : 'POST',
        headers : {'Content-Type' : 'application/json'},
        body : JSON.stringify(data)
    })
    return await req.json()
}

// ENVIO DE FORMULÁRIO
form.addEventListener("submit", async (e:Event) => {
    e.preventDefault()
    // Pegando dados do formulário
    let inputNome = document.getElementById('nome') as HTMLInputElement
    let inputEmail = document.getElementById('email') as HTMLInputElement
    let inputSenha = document.getElementById('senha') as HTMLInputElement

    const user: Usuario = {
        nome : inputNome.value,
        email : inputEmail.value,
        senha : inputSenha.value 
    }
    
    // Login
    if (user.nome == '' || user.nome == null) {
        try {
            if(user.email == '' || user.senha == '') {
                ShowModal('Preencha os campos', 'bg-red-800') 
            } else {
                const userJson: Usuario = await GetUsers(user.email)
                
                if(userJson.senha == null || user.senha === '') {
                    ShowModal('Usuário Inexistente', 'bg-red-800')
                } else {
                    if(userJson.senha === user.senha) {
                        // Modal de login de sucesso aqui
                        ShowModal('Login com SUCESSO!', 'bg-lime-600')
                        window.location.href = '/home.html'
                    } else {
                        ShowModal('Senha incorreta!', 'bg-red-800')
                    }   
                }
            }
        } catch (error) {
            console.error('Erro ao obter usuários:', error)
        }
    } else {
        // Nova conta
        try {
            if(user.email == '' || user.senha == '') {  // verificar se os campos estão vazios
                ShowModal('Preencha os campos', 'bg-red-800') 
            } else {
                const userJson2: Usuario = await GetUsers(user.email)  // verificar se o user já existe
                if(userJson2.email !== '') {
                    ShowModal('Usuário existente!', 'bg-red-800') 
                } else {
                    const res: object = await AddUsers(user)
                    if(res) {
                        ShowModal('Criado com SUCESSO!', 'bg-lime-600') 
                        AlterForm(true)
                    } else {
                        ShowModal('Erro ao criar usuário', 'bg-red-800') 
                    }
                }
            }
        }
        catch (error) {
            console.error('Erro ao adicionar usuários:', error)
        }
    }

    // Limpando os inputs
    inputNome.value = ''
    inputEmail.value = ''
    inputSenha.value = ''
})