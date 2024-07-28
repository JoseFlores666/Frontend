import React, { useState, useRef, useEffect } from "react";
import { useSoli } from "../context/SolicitudContext";
import "../css/solicitud.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { ImFileEmpty } from "react-icons/im";
import { useForm } from "react-hook-form";
import "../css/Animaciones.css";

export const AbonoSolicitud = () => {
    const { id } = useParams();


    const { handleSubmit, register, setValue, formState: { errors } } = useForm();

    const formRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [datosCargados, setDatosCargados] = useState(false);
    const [showItems, setShowItems] = useState(false);
    const { unasoli, getunSolitud, RealizarAbono } = useSoli();
    const [items, setItems] = useState([]);

    useEffect(() => {
        const cargarSolicitud = async () => {
            try {
                await getunSolitud(id);
                setDatosCargados(true);
            } catch (error) {
                console.error("Error al obtener la solicitud:", error);
            }
        };

        if (id && !datosCargados) {
            cargarSolicitud();
        }
    }, [id, datosCargados, getunSolitud]);

    useEffect(() => {
        if (datosCargados) {
            llenaSolicitud();
        }
    }, [datosCargados]);

    const llenaSolicitud = () => {
        try {
            console.log(unasoli)
            setValue("folio", unasoli.folio || "");
            setValue("folioExterno", unasoli.folioExterno || "");
            setValue("fecha", unasoli.fecha ? new Date(unasoli.fecha).toISOString().slice(0, 10) : "");
            setValue("items", unasoli.suministros || []);
            setItems(unasoli.suministros || []);

            if (unasoli.folioExterno) {
                setShowItems(true);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error al llenar los datos:", error);
        }
    };

    const onSubmit = async (data) => {
        try {
            data.id = id;
            // Eliminar propiedades no deseadas
            const { NumEntregas, ...restData } = data;
            delete restData[""];

            // Validar las cantidades
            for (const item of restData.items) {
                const totalCantidad = item.cantidadAcumulada + parseInt(item.cantidadEntregada, 10);
                if (totalCantidad > item.cantidad) {
                    Swal.fire({
                        title: "Error",
                        text: `La cantidad acumulada para el suministro excede la cantidad permitida.`,
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                    return;
                }
            }

            console.log(restData); // Imprime el objeto de datos para verificar

            const response = await RealizarAbono(id, restData);
            if (!response) {
                Swal.fire({
                    title: "Error",
                    text: "Error al abonar",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            } else {
                setDatosCargados(false)
                Swal.fire({
                    title: "Completado!",
                    text: response.mensaje,
                    icon: "success",
                    confirmButtonText: "Cool",
                });
            }
        } catch (error) {
            console.error("Error al guardar los datos:", error);
            Swal.fire({
                title: "Error!",
                text: "Hubo un problema al realizar el abono",
                icon: "error",
                confirmButtonText: "Ok",
            });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center mt-50 text-cool-gray-50 font-bold  ">
                    <div className="mb-4">Cargando...</div>
                    <ImFileEmpty className="animate-spin text-purple-50-500 text-6xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl p-4 text-black">
            <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="slide-down">
                <div className="bg-white p-6 rounded-md shadow-md">
                    <h1 className="text-2xl  font-bold text-center text-black mb-6">Área De Entregas</h1>
                    <div>
                        <div className="grid grid-cols-4 md:grid-cols-3 gap-6 mb-4">
                            <div>
                                <label
                                    htmlFor="folio"
                                    className="block text-sm font-medium mb-1"
                                >
                                    No. de folio:
                                </label>
                                <input
                                    type="text"
                                    disabled
                                    id="folio"
                                    name="folio"
                                    className="w-full cursor-not-allowed p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    {...register("folio")}
                                />
                                {errors.folio && <p>{errors.folio.message}</p>}
                            </div>
                            <div>
                                <label
                                    htmlFor="folioExterno"
                                    className="block text-sm font-medium mb-1"
                                >
                                    No. de folio externo:
                                </label>
                                <input
                                    type="text"
                                    disabled
                                    id="folioExterno"
                                    name="folioExterno"
                                    className="w-full cursor-not-allowed  p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    {...register("folioExterno")}
                                />

                                {errors.folioExterno && <p>{errors.folioExterno.message}</p>}
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-medium mb-1">
                                    Selecciona la fecha:
                                </label>
                                <input
                                    type="date"
                                    disabled
                                    id="fecha"
                                    name="fecha"
                                    className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500 cursor-not-allowed"
                                    {...register("fecha")}
                                />
                            </div>
                        </div>

                        {showItems && items.map((item, index) => (
                            <div key={index} className="space-y-4 mb-4">
                                <div className="flex flex-wrap space-x-4 mb-4">
                                    <div className="flex-1 min-w-[150px]">
                                        <label className="block text-sm font-medium mb-1">
                                            Cantidad:
                                        </label>
                                        <input
                                            disabled
                                            type="number"
                                            placeholder="Ingrese una cantidad"
                                            className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500 cursor-not-allowed"
                                            {...register(`items.${index}.cantidad`)}
                                            required
                                        />
                                        {errors.items?.[index]?.cantidad && (
                                            <p className="text-red-500 text-xs mt-1">{errors.items[index].cantidad.message}</p>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-[150px]">
                                        <label className="block text-sm font-medium mb-1">
                                            Unidad de medida:
                                        </label>
                                        <select
                                            className="w-full cursor-not-allowed p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                            disabled
                                            {...register(`items.${index}.unidad`)}
                                        >
                                            <option value="">Seleccione una opción</option>
                                            <option value="Paquete">Paquete</option>
                                            <option value="Rollo">Rollo</option>
                                            <option value="Caja">Caja</option>
                                        </select>
                                        {errors.items?.[index]?.unidad && (
                                            <p className="text-red-500 text-xs mt-1">{errors.items[index].unidad.message}</p>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-[150px]">
                                        <label className="block text-sm font-medium mb-1">
                                            Cantidad Acumulada:
                                        </label>
                                        <input
                                            type="number"
                                            disabled
                                            className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500 cursor-not-allowed"
                                            {...register(`items.${index}.cantidadAcumulada`)}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-[150px]">
                                        <label className="block text-sm font-medium mb-1">
                                            Cantidad a entregar:
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                            {...register(`items.${index}.cantidadEntregada`)}
                                        />
                                        {errors.items?.[index]?.cantidadEntregada && (
                                            <p className="text-red-500 text-xs mt-1">{errors.items[index].cantidadEntregada.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="NumeroDeEntregas"
                                            className="block text-sm font-medium mb-1">
                                            Numero De Entregas
                                        </label>
                                        <input
                                            type="number"
                                            disabled
                                            id="NumeroDeEntregas"
                                            name="NumeroDeEntregas"
                                            className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500 cursor-not-allowed"
                                            {...register(`items.${index}.NumeroDeEntregas`)}
                                        />
                                        {errors.items?.[index]?.NumeroDeEntregas && (
                                            <p className="text-red-500 text-xs mt-1">{errors.items[index].NumeroDeEntregas.message}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="min-w-[150px]">
                                    <label className="block text-sm font-medium mb-1">
                                        Descripción:
                                    </label>
                                    <textarea
                                        className="w-full p-3 cursor-not-allowed resize-none border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Ingrese la descripción"
                                        {...register(`items.${index}.descripcion`)}
                                        disabled
                                    ></textarea>
                                    {errors.items?.[index]?.descripcion && (
                                        <p className="text-red-500 text-xs mt-1">{errors.items[index].descripcion.message}</p>
                                    )}
                                </div>
                                <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
                            </div>
                        ))}
                        <div className="flex justify-center mt-8">
                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md border border-black"
                            >
                                Actualizar
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};
