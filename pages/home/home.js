function verifyAuthentication() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (!user) {
      // Se o usuário estiver autenticado, redirecione para a página de home
      window.location.href = "../../index.html"; // Redireciona para a página de login
    } else {
      document.body.style.visibility = "visible";
    }
  });
}
firebase.initializeApp(firebaseConfig);

document.addEventListener("DOMContentLoaded", function () {
  verifyAuthentication();
});

function showMenu() {
  document.getElementById("show-menu").querySelector("ul").style.display =
    "block";
}

function hideMenu() {
  document.getElementById("show-menu").querySelector("ul").style.display =
    "none";
}
function GoToPacientes() {
  window.location.href = "../pacientes/pacientes.html";
}
function logout() {
  showLoading();
  firebase
    .auth()
    .signOut()
    .then(function () {
      // Logout bem-sucedido
      window.location.href = "../../index.html";
      // Redirecione ou execute outras ações após o logout, se necessário
    })
    .catch(function (error) {
      // Ocorreu um erro durante o logout
      console.error("Erro durante o logout:", error);
    });
}

function createNew() {
  document.getElementById("novo-agendamento").style.display = "flex";
}

function hideCreateNew() {
  document.getElementById("nome").value = "";
  document.getElementById("data").value = "";
  document.getElementById("horario").value = "";
  document.getElementById("tipo").value = "";
  document.getElementById("responsavel").value = "";
  document.getElementById("novo-agendamento").style.display = "none";
}
function agendar() {
  let nameAgendar = document.getElementById("nome").value;
  let dataAgendar = document.getElementById("data").value;
  let horarioAgendar = document.getElementById("horario").value;
  let tipoAgendar = document.getElementById("tipo").value;
  let responsavelAgendar = document.getElementById("responsavel").value;

  if (
    !nameAgendar ||
    !dataAgendar ||
    !horarioAgendar ||
    !tipoAgendar ||
    !responsavelAgendar
  ) {
    alert("Todos os campos devem ser preenchidos");
  } else {
    novaData = FormatDate(dataAgendar);
    const db = firebase.firestore();
    const colecao = db.collection("agendamentos");
    colecao
      .add({
        data: novaData,
        horario: horarioAgendar,
        nome: nameAgendar,
        responsavel: responsavelAgendar,
        tipo: tipoAgendar,
      })
      .then((docRef) => alert("Agendamento bem sucedido. ID:" + docRef.id));
    hideCreateNew();
    findDados();
  }
}

function filtrarPorResponsavel(dadosFiltrados){


  const arrayDadosFiltrados=Object.entries(dadosFiltrados);
  const responsavelFilter=document.getElementById("responsavel-select").value;

  if(responsavelFilter==="Todos"){
    return dadosFiltrados;
  }

  const dadosFiltradosAposResponsvael = arrayDadosFiltrados.filter(([chave,paciente])=>{
    return paciente.responsavel === responsavelFilter;
  });

  const resultadoFiltradoPorResponsvael = Object.fromEntries(dadosFiltradosAposResponsvael);

return resultadoFiltradoPorResponsvael;



}
function showPacientes(dados) {
  var pacientesDiv = document.getElementById("pacientes");

  if (dados) {
    // Limpar conteúdo existente antes de adicionar novos elementos
    pacientesDiv.innerHTML = "";

    for (var pacienteId in dados) {
      if (dados.hasOwnProperty(pacienteId)) {
        var paciente = dados[pacienteId];

        var divPaciente = document.createElement("div");
        divPaciente.setAttribute("class", "paciente"); // Use "class" para aplicar estilos CSS
        divPaciente.setAttribute("id", pacienteId); // Use "class" para aplicar estilos CSS

        var divInfo = document.createElement("div"); // Esta div engloba as informações do paciente
        divInfo.setAttribute("class", "info");

        var divNome = document.createElement("div");
        divNome.setAttribute("class", "nome");
        divNome.innerHTML = "<span class='infos'>Nome: </span>" + paciente.nome;

        var divHorario = document.createElement("div");
        divHorario.setAttribute("class", "horario");
        divHorario.innerHTML =
          "<span class='infos'>Horário: </span>" + paciente.horario;

        var divTipo = document.createElement("div");
        divTipo.setAttribute("class", "tipo");
        divTipo.innerHTML =
          "<span class='infos'>Tipo de atendimento: </span>" + paciente.tipo;

        var divResponsavel = document.createElement("div");
        divResponsavel.setAttribute("class", "responsavel");
        divResponsavel.innerHTML =
          "<span class='infos'>Responsável: </span>" + paciente.responsavel;

        divInfo.appendChild(divNome);
        divInfo.appendChild(divHorario);
        divInfo.appendChild(divTipo);
        divInfo.appendChild(divResponsavel);
        const inputButton = document.createElement("button");
        inputButton.setAttribute("onclick", "cancelar(this)");
        inputButton.setAttribute("id", "cancelar");
        inputButton.innerText = "X";

        divPaciente.appendChild(inputButton);
        divPaciente.appendChild(divInfo);
        pacientesDiv.appendChild(divPaciente);
      }
    }
  } else {
    console.error("O objeto 'dados' não está definido corretamente.");
  }
}

function cancelar(button) {
  const div = button.parentNode;
  const idDocument = div.id;
  const db = firebase.firestore();
  const colecao = db.collection("agendamentos");

  const confirmacao = confirm(
    "Tem certeza que deseja cancelar esse atendimento?"
  );

  if (confirmacao) {
    colecao
      .doc(idDocument)
      .delete()
      .then(() => {
        alert("Agendamento cancelado com sucesso!");
      })
      .catch((error) => {
        alert("Erro ao deletar documento:" + error);
      });
    findDados();
  }
}

async function findDados() {
  try {
    // Obtém a referência para a coleção "agendamentos"
    const agendamentosCollection = firebase
      .firestore()
      .collection("agendamentos");

    // Obtém os documentos da coleção
    const snapshot = await agendamentosCollection.get();

    // Objeto para armazenar os dados
    const dados = {};

    // Itera sobre os documentos e armazena no objeto "dados"
    snapshot.forEach((doc) => {
      dados[doc.id] = doc.data();
    });

    //ordena dados por horario
    const dadosOrdenados = ordenarPorHorario(dados);

    const data = document.getElementById("dateToShow").value;
    let dataEspecifica = FormatDate(data);

    let dadosFiltrados = filtrarPorData(dadosOrdenados, dataEspecifica);
    let dadosFiltradosAposResponsvael=filtrarPorResponsavel(dadosFiltrados);
    showPacientes(dadosFiltradosAposResponsvael);

    // Retorna o objeto "dados" se necessário
    return dados;
  } catch (error) {
    console.error("Erro na execução da função:", error);
    throw error; // Lança o erro novamente para indicar falha
  }
}
function ordenarPorHorario(dados) {
  // Converte o objeto em um array de pares chave-valor
  const arrayDados = Object.entries(dados);

  // Ordena o array com base no atributo 'horario' de cada paciente
  arrayDados.sort((a, b) => {
    const horarioA = a[1].horario.split(":").map(Number); // Converte o horário em um array de números
    const horarioB = b[1].horario.split(":").map(Number); // Converte o horário em um array de números

    // Compara as horas
    if (horarioA[0] < horarioB[0]) {
      return -1;
    } else if (horarioA[0] > horarioB[0]) {
      return 1;
    } else {
      // Se as horas são iguais, compare os minutos
      if (horarioA[1] < horarioB[1]) {
        return -1;
      } else if (horarioA[1] > horarioB[1]) {
        return 1;
      } else {
        return 0; // Horas e minutos são iguais
      }
    }
  });

  // Converte o array ordenado de volta para um objeto
  const dadosOrdenados = Object.fromEntries(arrayDados);

  return dadosOrdenados;
}

function filtrarPorData(dados, dataFiltrar) {
  // Converte o objeto em um array de pares chave-valor
  const arrayDados = Object.entries(dados);

  // Filtra o array para manter apenas os elementos com a data especificada
  const dadosFiltrados = arrayDados.filter(([chave, paciente]) => {
    return paciente.data === dataFiltrar;
  });

  // Converte o array filtrado de volta para um objeto
  const resultadoFiltrado = Object.fromEntries(dadosFiltrados);

  return resultadoFiltrado;
}

function FormatDate(dataToConvert) {
  let dataBrasil = dataToConvert.split("-").reverse().join("/");

  return dataBrasil;
}
