
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Usuario = {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  nascimento: string;
  senha: string;
};

const usuarioVazio: Usuario = {
  nome: "",
  email: "",
  cpf: "",
  telefone: "",
  cep: "",
  endereco: "",
  numero: "",
  bairro: "",
  cidade: "",
  estado: "",
  nascimento: "",
  senha: "",
};

export default function EditarUsuario() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [form, setForm] = useState<Usuario>(usuarioVazio);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function buscarUsuario() {
      try {
        const resposta = await fetch(
          `/api/usuarios/${id}`
        );

        if (!resposta.ok) {
          throw new Error("Usuário não encontrado");
        }

        const dados: Usuario = await resposta.json();
        setForm({ ...usuarioVazio, ...dados });
      } catch {
        setErro("Não foi possível carregar o usuário.");
      } finally {
        setCarregando(false);
      }
    }

    buscarUsuario();
  }, [id]);

  function alterar(campo: keyof Usuario, valor: string) {
    setForm((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  function mascara(
    valor: string,
    tipo: "cpf" | "telefone" | "cep" | "nascimento"
  ) {
    const n = valor.replace(/\D/g, "");

    if (tipo === "cpf") {
      return n.slice(0, 11)
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1-$2");
    }

    if (tipo === "telefone") {
      const digitos = n.slice(0, 11);
      return digitos.length <= 10
        ? digitos
            .replace(/^(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{4})(\d{1,4})$/, "$1-$2")
        : digitos
            .replace(/^(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
    }

    if (tipo === "cep") {
      return n.slice(0, 8)
        .replace(/^(\d{5})(\d)/, "$1-$2");
    }

    return n.slice(0, 8)
      .replace(/^(\d{2})(\d)/, "$1/$2")
      .replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    const cpf = form.cpf.replace(/\D/g, "");
    const telefone = form.telefone.replace(/\D/g, "");
    const cep = form.cep.replace(/\D/g, "");

    if (
      !form.nome.trim() ||
      !form.email.trim() ||
      !form.senha ||
      cpf.length !== 11 ||
      telefone.length < 10 ||
      telefone.length > 11 ||
      cep.length !== 8
    ) {
      setErro("Preencha corretamente os campos obrigatórios.");
      return;
    }

    const [dia, mes, ano] = form.nascimento.split("/").map(Number);
    const data = new Date(ano, mes - 1, dia);

    if (
      !ano ||
      ano < 1900 ||
      data.getFullYear() !== ano ||
      data.getMonth() !== mes - 1 ||
      data.getDate() !== dia ||
      data > new Date()
    ) {
      setErro("Informe uma data de nascimento válida.");
      return;
    }

    setSalvando(true);

    try {
      const resposta = await fetch(
        `/api/usuarios/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!resposta.ok) {
        throw new Error("Erro ao atualizar usuário");
      }

      router.push("/");
    } catch {
      setErro("Não foi possível atualizar o usuário.");
    } finally {
      setSalvando(false);
    }
  }

  const campos = [
    { nome: "nome", titulo: "Nome completo" },
    { nome: "email", titulo: "E-mail" },
    { nome: "cpf", titulo: "CPF" },
    { nome: "telefone", titulo: "Telefone" },
    { nome: "cep", titulo: "CEP" },
    { nome: "endereco", titulo: "Endereço / Rua" },
    { nome: "numero", titulo: "Número" },
    { nome: "bairro", titulo: "Bairro" },
    { nome: "cidade", titulo: "Cidade" },
    { nome: "estado", titulo: "Estado (UF)" },
    { nome: "nascimento", titulo: "Data de nascimento" },
    { nome: "senha", titulo: "Senha" },
  ] as const;

  if (carregando) {
    return <main style={{ padding: 30 }}>Carregando...</main>;
  }

  if (erro && !form.nome) {
    return <main style={{ padding: 30 }}>{erro}</main>;
  }

  return (
    <main style={{ padding: 30, maxWidth: 650 }}>
      <h1>Editar Usuário</h1>

      <form onSubmit={salvar}>
        {campos.map((campo) => (
          <div key={campo.nome} style={{ marginBottom: 15 }}>
            <label
              htmlFor={campo.nome}
              style={{ display: "block", marginBottom: 5 }}
            >
              {campo.titulo}
            </label>

            <input
              id={campo.nome}
              type={
                campo.nome === "senha"
                  ? "password"
                  : campo.nome === "email"
                    ? "email"
                    : "text"
              }
              value={form[campo.nome]}
              required
              maxLength={
                campo.nome === "cpf" ? 14 :
                campo.nome === "telefone" ? 15 :
                campo.nome === "cep" ? 9 :
                campo.nome === "nascimento" ? 10 :
                campo.nome === "estado" ? 2 :
                undefined
              }
              onChange={(e) => {
                const nome = campo.nome;
                const valor = e.target.value;

                if (
                  nome === "cpf" ||
                  nome === "telefone" ||
                  nome === "cep" ||
                  nome === "nascimento"
                ) {
                  alterar(nome, mascara(valor, nome));
                } else {
                  alterar(nome, valor);
                }
              }}
              style={{
                padding: 10,
                width: "100%",
                boxSizing: "border-box",
              }}
            />
          </div>
        ))}

        {erro && <p role="alert">{erro}</p>}

        <button type="submit" disabled={salvando}>
          {salvando ? "Salvando..." : "Salvar alterações"}
        </button>

        {" "}

        <button
          type="button"
          onClick={() => router.push("/")}
        >
          Cancelar
        </button>
      </form>
    </main>
  );
}
