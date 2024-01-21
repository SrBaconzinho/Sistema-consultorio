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

verifyAuthentication();