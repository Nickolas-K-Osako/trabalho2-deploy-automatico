
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CadastroUsuario() {
  const router = useRouter();

  const [form, setForm] = useState({
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
  });

  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  function alterar(
    campo: keyof typeof form,
    valor: string
  ) {
    setForm((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  function mascara(
    valor: string,
    tipo: "cpf" | "telefone" | "cep" | "data"
  ) {
    const n = valor.replace(/\D/g, "");

    if (tipo === "cpf") {
      return n.slice(0, 11)
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1-$2");
    }

    if (tipo === "telefone") {
      return n.slice(0, 11)
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

  async function cadastrar(e: React.FormEvent) {
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
        "/api/usuarios",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!resposta.ok) {
        throw new Error("Falha ao cadastrar");
      }

      router.push("/");
    } catch {
      setErro("Erro ao cadastrar usuário.");
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

  return (
    <main style={{ padding: 30, maxWidth: 650 }}>
      <h1>Cadastro de Usuário</h1>

      <form onSubmit={cadastrar}>
        {campos.map((campo) => (
          <div
            key={campo.nome}
            style={{ marginBottom: 15 }}
          >
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
                const valor = e.target.value;
                const nome = campo.nome;

                if (
                  nome === "cpf" ||
                  nome === "telefone" ||
                  nome === "cep" ||
                  nome === "nascimento"
                ) {
                  alterar(
                    nome,
                    mascara(
                      valor,
                      nome === "nascimento" ? "data" : nome
                    )
                  );
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
          {salvando ? "Salvando..." : "Cadastrar usuário"}
        </button>
      </form>
    </main>
  );
}
