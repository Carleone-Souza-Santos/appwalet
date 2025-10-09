"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import styled, { keyframes } from "styled-components";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth, db, storage } from "@/firebase/config";
import { FiLogOut } from "react-icons/fi";
import { FaWpforms } from "react-icons/fa";
import ComparisonModal from "./ComparisonModal";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// ======= Animação =======
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ======= Estilos =======
const Container = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 10px 20px;
  background: linear-gradient(
    to right,
    rgba(0, 54, 80, 0.1),
    rgba(0, 54, 80, 0.4),
    rgba(0, 54, 80, 0.8)
  );
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  z-index: 1000;
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserCircle = styled.label<{ $delay: number }>`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  animation: ${fadeIn} 0.5s ease forwards;
  animation-delay: ${({ $delay }) => $delay}s;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const UserImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  transition: transform 0.3s;
  &:hover {
    transform: scale(1.1);
  }
`;

const UserName = styled.span`
  font-size: 0.95rem;
  font-weight: 500;
  color: #3e677a;
`;

const IconButton = styled.button`
  background: #fff;
  color: #003650;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
  &:hover {
    background: #f0f0f0;
    transform: scale(1.05);
  }
`;

// ======= Componente principal =======
export default function Header() {
  const { user, loading } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [userName, setUserName] = useState("Usuário");
  const [userPhoto, setUserPhoto] = useState("/assets/logo.png");

  useEffect(() => {
    if (!user) return;

    const loadUserData = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        let name = "Usuário";
        let photo = "/assets/logo.png";

        if (userSnap.exists()) {
          const data = userSnap.data();
          if (data.name) name = data.name;
          if (data.photoURL) photo = data.photoURL;
        }

        setUserName(name);
        setUserPhoto(photo);

        localStorage.setItem("userName", name);
        localStorage.setItem("userPhoto", photo);
      } catch (err) {
        console.error("Erro ao carregar dados do usuário:", err);
      }
    };

    loadUserData();
  }, [user]);

  // ======= Trocar foto =======
  const handlePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    const previewURL = URL.createObjectURL(file);
    setUserPhoto(previewURL);

    try {
      const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { photoURL: downloadURL });

      setUserPhoto(downloadURL);
      localStorage.setItem("userPhoto", downloadURL);
    } catch (err) {
      console.error("Erro ao enviar a foto:", err);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("userName");
    localStorage.removeItem("userPhoto");
    window.location.reload();
  };

  if (loading) return null;

  return (
    <Container>
      {user && (
        <>
          <LeftGroup>
            <UserCircle $delay={0.2} title="Clique para trocar a foto">
              <UserImage src={userPhoto} alt="Foto do usuário" />
              <UserName>{userName}</UserName>
              <HiddenFileInput type="file" accept="image/*" onChange={handlePhotoChange} />
            </UserCircle>
          </LeftGroup>

          <RightGroup>
            <IconButton title="Abrir formulário" onClick={() => setModalOpen(true)}>
              <FaWpforms size={14} />
            </IconButton>

            <IconButton title="Sair" onClick={handleLogout}>
              <FiLogOut size={14} />
            </IconButton>

            {modalOpen && <ComparisonModal onClose={() => setModalOpen(false)} />}
          </RightGroup>
        </>
      )}
    </Container>
  );
}
