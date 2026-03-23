"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5071/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao fazer login");
      }

      const data = await response.json();

      console.log("Login response:", data);

      // salvar token
      localStorage.setItem("token", data.token);

      alert("Login realizado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Falha no login");
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Login </h1>

      <form
        onSubmit={handleLogin}
        style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 300 }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Entrar</button>
      </form>
    </main>
  );
}