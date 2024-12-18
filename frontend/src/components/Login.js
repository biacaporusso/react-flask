import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/login", {
        username,
        password,
      });
  
      if (response.data.success) {
        alert("Login bem-sucedido!");
        navigate("/home");  // Redirecionando para a home após o login bem-sucedido
      } else {
        alert(response.data.message);  // Exibindo a mensagem de erro do login
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Erro ao tentar login. Tente novamente.");
    }
  };
  

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="username"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Entrar</button>
      </form>
      <p>Não tem conta? <a href="/register">Cadastre-se</a></p>
    </div>
  );
}

export default Login;
