import React, { useEffect, useState } from "react";
import { useForm } from "../../hooks/useForm";
import { useSelector } from "react-redux";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Divider } from "primereact/divider";
import UserService from "../../services/UserService";

export const Login = () => {

	const userService = new UserService();

	const { isLoading, loginInfo  } = useSelector((state) => state.user);
	const [isLogin, setIsLogin] = useState(true);

	const {
		email,
		password,
		name,
		onInputChange,
		formState,
		onResetForm
	} = useForm({
		email: "",
		password: "",
		name: ""
	});

	useEffect(() => {
		if (loginInfo.severity === "success") {
			setTimeout(() => {
				userService.clearUser();
				setIsLogin(true);
				onResetForm();
			}
			, 2000);
		}
		
	}, [loginInfo]);

	const handleSubmit = async (e) => {
		e.preventDefault();
	  
		if (isLogin) {
		  userService.logInUser(formState);
		} else {
		  await userService.signUpUser(formState);
		}
	  };

	const toggleFormMode = () => {
		onResetForm();
		setIsLogin(!isLogin);
		userService.clearUser();
	};

	return (
		<div className="flex align-items-center justify-content-center min-h-screen bg-gray-100">
			<div className="w-full md:w-6 lg:w-4" style={{ maxWidth: "400px" }}>
				<div className="surface-card p-4 shadow-2 border-round">
					<div className="text-center mb-5">
						<div className="text-900 text-3xl font-medium mb-3">
							{isLogin ? "Iniciar sesión" : "Registrarse"}
						</div>
						<span className="text-600 font-medium line-height-3">
							{isLogin ? "Ingresa tus credenciales" : "Crea una nueva cuenta"}
						</span>
					</div>

					{loginInfo && (
						<Message
							severity={loginInfo.severity}
							text={loginInfo.message}
							className="w-full mb-3"
						/>
					)}

					<form onSubmit={handleSubmit}>
						{!isLogin && (
							<div className="mb-3">
								<label htmlFor="name" className="block text-900 font-medium mb-2">
									Nombre de usuario
								</label>
								<InputText
									id="name"
									name="name"
									value={name}
									onChange={onInputChange}
									placeholder="Tu nombre de usuario"
									className="w-full"
									required={!isLogin}
								/>
							</div>
						)}

						<div className="mb-3">
							<label htmlFor="email" className="block text-900 font-medium mb-2">
								Correo electrónico
							</label>
							<InputText
								id="email"
								name="email"
								type="email"
								value={email}
								onChange={onInputChange}
								placeholder="ejemplo@correo.com"
								className="w-full"
								required
							/>
						</div>

						<div className="mb-5">
							<label htmlFor="password" className="block text-900 font-medium mb-2">
								Contraseña
							</label>
							<InputText
								id="password"
								name="password"
								type="password"
								value={password}
								onChange={onInputChange}
								placeholder="Ingresa tu contraseña"
								className="w-full"
								required
							/>
						</div>

						<Button
							label={isLoading ? "Cargando..." : (isLogin ? "Iniciar sesión" : "Registrarse")}
							icon={isLoading ? "pi pi-spinner pi-spin" : (isLogin ? "pi pi-sign-in" : "pi pi-user-plus")}
							className="w-full"
							disabled={isLoading}
							type="submit"
						/>

						<Divider align="center" className="my-3">
							<span className="text-600 text-sm">O</span>
						</Divider>

						<div className="text-center">
							<Button
								label={isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
								link
								className="p-0"
								onClick={toggleFormMode}
							/>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};
