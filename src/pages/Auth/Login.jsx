import React, { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { useDispatch, useSelector } from "react-redux";
import UserService from "../../services/UserService";
import { setError } from "../../slices/user";
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';

export const Login = () => {
    const userService = new UserService();
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector((state) => state.user);
    const [isLogin, setIsLogin] = useState(true);

    const {
        email,
        password,
        onInputChange,
        formState
    } = useForm({
        email: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(setError(null));
        try {
            userService.logInUser(formState);
        } catch (err) {
            dispatch(setError(err.message || "Error al iniciar sesión"));
        }
    };

    return (
        <div
            className="p-d-flex p-jc-center p-ai-center"
            style={{ minHeight: '100vh', backgroundColor: '#f4f4f4' }}
        >
            <div
                className="p-card p-shadow-5"
                style={{ width: '100%', maxWidth: '400px', borderRadius: '10px' }}
            >
                <div className="p-card-body">
                    <h2
                        className="p-text-center"
                        style={{ marginBottom: '20px', fontWeight: '600', fontSize: '24px' }}
                    >
                        Iniciar sesión
                    </h2>

                    {error && (
                        <div
                            className="p-alert p-alert-error"
                            style={{ marginBottom: '10px' }}
                        >
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="p-field">
                            <label htmlFor="email" className="p-text-bold">
                                Correo electrónico
                            </label>
                            <InputText
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={onInputChange}
                                placeholder="Ingresa tu correo electrónico"
                                className="p-inputtext p-component p-inputtext-sm"
                                style={{ width: '100%', marginBottom: '10px' }}
                            />
                        </div>
                        <div className="p-field">
                            <label htmlFor="password" className="p-text-bold">
                                Contraseña
                            </label>
                            <InputText
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={onInputChange}
                                placeholder="Ingresa tu contraseña"
                                className="p-inputtext p-component p-inputtext-sm"
                                style={{ width: '100%', marginBottom: '20px' }}
                            />
                        </div>
                        <div className="p-d-flex p-jc-center">
                            <Button
                                label={isLoading ? "Cargando..." : "Iniciar sesión"}
                                className="p-button p-button-rounded p-button-primary"
                                style={{ width: '100%' }}
                                disabled={isLoading}
                                type="submit"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};