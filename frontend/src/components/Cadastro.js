import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Cadastro() {
  const [username, setUsername] = useState(""); // Adicionando username
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/register", {
        username,  // Enviando o username também
        password,
      });

      if (response.data.success) {
        alert("Cadastro bem-sucedido! Faça login.");
        navigate("/");  // Redirecionando para a página de login
      } else {
        alert("Erro ao registrar");
      }
    } catch (error) {
      console.error("Erro ao registrar:", error);
    }
  };

  return (
    <div>
      <h1>Cadastro</h1>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Adicionando campo para o username
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Cadastrar</button>
      </form>
      <p>Já tem conta? <a href="/">Faça login</a></p>
    </div>
  );
}

export default Cadastro;
