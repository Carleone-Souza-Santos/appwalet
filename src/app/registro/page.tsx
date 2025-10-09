"use client";

import React, { useState, FormEvent } from "react";
import { createUserWithEmailAndPassword, updateProfile, getAuth } from "firebase/auth";
import { app, db, storage } from "@/firebase/config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import styled from "styled-components";

// ===== Styled Components =====
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("/assets/financ.jpg") center/cover no-repeat;
  padding: 20px;
`;

const RegisterBox = styled.div`
  width: 100%;
  max-width: 420px;
  background: #ffffffee;
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
  text-align: center;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 25px;
  color: #032618;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  transition: all 0.2s;
  &:focus {
    border-color: #032618;
    outline: none;
    box-shadow: 0 0 6px rgba(3,38,24,0.5);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px 0;
  margin-top: 10px;
  border: none;
  border-radius: 8px;
  background: #032618;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    background: #064c31;
    transform: translateY(-2px);
  }
`;

const AltText = styled.p`
  margin-top: 20px;
  font-size: 0.95rem;
  color: #555;
  a {
    color: #032618;
    font-weight: 600;
    text-decoration: none;
    &:hover { color: #0b5c38; }
  }
`;

const FileInput = styled(Input)`padding: 8px 10px;`;

const Registro: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = getAuth(app);

  const handleRegistro = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let photoURL = "";
      if (photo) {
        const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);
        await uploadBytes(storageRef, photo);
        photoURL = await getDownloadURL(storageRef);
      }

      await updateProfile(user, { displayName: name, photoURL });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        photoURL,
        role: "bloqueado",
        day: 7,
        disabled: false,
        createdAt: serverTimestamp(),
      });

      localStorage.setItem("userName", name);
      localStorage.setItem("userPhoto", photoURL);

      router.push("/login");
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") alert("Este e-mail já está em uso.");
      else alert("Erro ao registrar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <RegisterBox>
        <Title>Criar Conta</Title>
        <form onSubmit={handleRegistro}>
          <Input type="text" placeholder="Nome completo" value={name} onChange={e => setName(e.target.value)} required />
          <Input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required />
          <FileInput type="file" accept="image/*" onChange={e => e.target.files && setPhoto(e.target.files[0])} />
          <Button type="submit" disabled={loading}>{loading ? "Salvando..." : "Registrar"}</Button>
        </form>
        <AltText>Já possui uma conta? <a href="/login">Entrar</a></AltText>
      </RegisterBox>
    </Container>
  );
};

export default Registro;
