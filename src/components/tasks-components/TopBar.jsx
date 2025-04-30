import React from 'react';
import { Menubar } from 'primereact/menubar';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearUser } from '../../slices/user';

export const TopBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    dispatch(clearUser());
    navigate('/login');
  };

  const items = [
    {
      label: 'Usuario', // Movemos la etiqueta de usuario aquí
      icon: 'pi pi-user',
      items: [
        {
          label: 'Cerrar sesión',
          icon: 'pi pi-sign-out',
          command: logout,
        },
      ],
    },
  ];

  const start = (
    <div className="flex items-center gap-2 pl-4">
      <span className="font-bold text-lg">MI APP</span>
    </div>
  );

  return <Menubar model={items} start={start} style={{justifyContent: "space-between", marginBottom: "1rem"}}/>;
};