function verifyAuthentication() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // Se o usuário estiver autenticado, faça alguma coisa (ex: redirecione para a página de home)
      console.log('Usuário autenticado:', user.uid);
      
    } else {
      // Se o usuário não estiver autenticado, redirecione para a página de login ou tome outra ação
      console.log('Usuário não autenticado');
      // Redirecionar para a página de login, por exemplo
      window.location.replace("../../index.html");
    }
  });
}
// inserir funções do menu
function showCadastro(){
  document.getElementById('container').style.display="block";
}

function hideCadastro(){
  document.getElementById('container').style.display="none";
}

function cadastrarNew(){
  // Adicionar lógica para cadastrar um novo aluno
}

function showFicha(div) {
  let idAluno = div.id;
  console.log(idAluno);
}

function addTohtml() {
  findAlunos().then((alunos) => {
    let divAlunos = document.getElementById("alunos");

    if (alunos) {
      divAlunos.innerHTML = "";

      for (var alunoId in alunos) {
        if (alunos.hasOwnProperty(alunoId)) {
          var aluno = alunos[alunoId];

          var boxAluno = document.createElement('div');
          boxAluno.setAttribute('class', 'boxAluno');
          boxAluno.setAttribute('id', alunoId);
          boxAluno.setAttribute('onclick', 'showFicha(this)');

          var divNome = document.createElement('div');
          divNome.setAttribute('class', "nome");
          divNome.innerHTML = "<span>Nome: </span>" + aluno.nome;

          var divSexo = document.createElement('div');
          divSexo.setAttribute('class', 'sexo');
          divSexo.innerHTML = "<span>Sexo: </span>" + aluno.sexo;

          var divIdade = document.createElement('div');
          divIdade.setAttribute('class', 'idade');
          const idade = converterIdade(aluno.data);
          divIdade.innerHTML = "<span>Idade: </span>" + idade + " anos";
          var divTell=document.createElement('div');
          divTell.setAttribute('class','tell');
          divTell.innerHTML="<span>Telefone: </span>" + aluno.tell;
          divServico=document.createElement('div');
          divServico.setAttribute('class','servico');
          divServico.innerHTML='<span>Serviço: </span>'+aluno.servico;

          // Botão para apagar do registro
          var inputButton = document.createElement('button');
          inputButton.setAttribute("onclick", 'dellAluno(this);');
          inputButton.setAttribute('id', 'cancelar');
          inputButton.innerHTML = "X";

          boxAluno.appendChild(divNome);
          boxAluno.appendChild(divSexo);
          boxAluno.appendChild(divIdade);
          boxAluno.appendChild(divTell);
          boxAluno.appendChild(divServico);
          boxAluno.appendChild(inputButton);

          divAlunos.appendChild(boxAluno);
        }
      }
    }
  })
}

async function findAlunos() {
  try {
    const AlunosCollection = firebase.firestore().collection("alunos");
    const snapshot = await AlunosCollection.get();
    let alunos = {}

    snapshot.forEach((doc) => {
      alunos[doc.id] = doc.data();
    });

    alunos = ordenarPorAlfabeto(alunos);
    console.log(alunos);

    return alunos;
  } catch (error) {
    alert(error.message);
  }
}

function ordenarPorAlfabeto(alunos) {
  var ArrayObjetos = Object.entries(alunos);
  
  ArrayObjetos.sort(function(a, b) {
    var nomeA = a[1].nome.toUpperCase();
    var nomeB = b[1].nome.toUpperCase();

    if (nomeA < nomeB) {
      return -1;
    }
    if (nomeA > nomeB) {
      return 1;
    }
    return 0;
  });

  var objetosOrdenados = {};

  ArrayObjetos.forEach(function(item) {
    objetosOrdenados[item[0]] = item[1];
  });

  return objetosOrdenados;
}

function converterIdade(dataNascimentostring) {
  if (dataNascimentostring) {
    // Convertendo a string da data de nascimento para um objeto Date
    var partesData = dataNascimentostring.split("/");
    var dataNascimento = new Date(partesData[2], partesData[1] - 1, partesData[0]); // Ano, Mês, Dia
  
    // Obtendo a data atual
    var dataAtual = new Date();

    // Calculando a diferença entre os anos
    var idade = dataAtual.getFullYear() - dataNascimento.getFullYear();

    // Verificando se o aniversário ainda não ocorreu neste ano
    if (dataAtual.getMonth() < dataNascimento.getMonth() || 
       (dataAtual.getMonth() === dataNascimento.getMonth() && dataAtual.getDate() < dataNascimento.getDate())) {
        idade--;
    }

    // Convertendo a idade para string e retornando
    return idade.toString();
  } else {
    // Caso a data de nascimento seja undefined, retorne uma string vazia ou outra valor padrão
    return "";
  }
}

function dellAluno(button) {
  var docID = button.parentNode.id;
  const db = firebase.firestore();
  var pacienteDell = db.collection("alunos");

  isConfirm = confirm("Tem certeza que deseja deletar esse paciente?");

  if (isConfirm) {
    pacienteDell
      .doc(docID)
      .delete()
      .then(() => {
        alert("Aluno deletado com sucesso");
        addTohtml();
      })
      .catch((error) => {
        alert("Erro ao deletar!");
      });
  }
}


addTohtml();
verifyAuthentication();
