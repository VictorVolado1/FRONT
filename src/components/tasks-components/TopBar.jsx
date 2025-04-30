import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
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
      label: 'Opciones',
      icon: 'pi pi-cog',
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
    <div className="flex align-items-center gap-2">
      <Avatar icon="pi pi-user" shape="circle" />
      <span className="font-bold">Mi Aplicación</span>
    </div>
  );

  return <Menubar model={items} start={start} />;

};