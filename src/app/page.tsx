
"use client";

import { useEffect, useState } from "react";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
}

export default function Home() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // READ - Buscar usuários
  useEffect(() => {
    async function buscarUsuarios() {
      try {
        const resposta = await fetch(
          "/api/usuarios"
        );

        if (!resposta.ok) {
          throw new Error("Erro ao buscar usuários");
        }

        const dados: Usuario[] = await resposta.json();
        setUsuarios(dados);
      } catch {
        setErro("Não foi possível carregar os usuários.");
      } finally {
        setCarregando(false);
      }
    }

    buscarUsuarios();
  }, []);

  // DELETE - Excluir usuário
  async function excluirUsuario(id: string) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este usuário?"
    );

    if (!confirmar) return;

    try {
      const resposta = await fetch(
        `/api/usuarios/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!resposta.ok) {
        throw new Error("Erro ao excluir usuário");
      }

      setUsuarios((anteriores) =>
        anteriores.filter((usuario) => usuario.id !== id)
      );
    } catch {
      alert("Não foi possível excluir o usuário.");
    }
  }

  return (
    <main style={{ padding: "30px" }}>
      <h1>Gerenciamento de Usuários - Deploy Automático</h1>
      <h2>Listagem de Usuários</h2>

      <a href="/usuarios/novo">
        Cadastrar novo usuário
      </a>

      {carregando ? (
        <p>Carregando usuários...</p>
      ) : erro ? (
        <p>{erro}</p>
      ) : usuarios.length === 0 ? (
        <p>Nenhum usuário cadastrado.</p>
      ) : (
        <table border={1} cellPadding={10}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nome}</td>
                <td>{usuario.email}</td>
                <td>{usuario.cpf}</td>
                <td>{usuario.telefone}</td>

                <td>
                  <a href={`/usuarios/editar/${usuario.id}`}>
                    Editar
                  </a>

                  {" | "}

                  <button
                    type="button"
                    onClick={() =>
                      excluirUsuario(usuario.id)
                    }
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
