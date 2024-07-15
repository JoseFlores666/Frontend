import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faClone } from '@fortawesome/free-solid-svg-icons';
import { useSoli } from "../context/SolicitudContext";


export const RegisterTecPage2 = () => {
    const { register, handleSubmit } = useForm();
    const [fechaAtencion, setFechaAtencion] = useState("");

    const { historialOrden,//t
        traeHistorialOrden }//funcion para traer todos los campos de 
         = useSoli();

    const [items, setItems] = useState([{ cantidad: "", descripcion: "" }]);
    const [itemsH, setItemsH] = useState([
        { descripcion: '', historial: ['Historial 1', 'Historial 2'] }
    ]);
    const [showHistorial, setShowHistorial] = useState(null); // Estado para controlar el historial visible
    const descripcionRefs = useRef([]);

    const eliminarItem = (index, e) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleClickOutside = (event) => {
        if (
            descripcionRefs.current.every((ref, index) => {
                return ref && !ref.contains(event.target);
            })
        ) {
            setShowHistorial(null);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const toggleHistorial = (index) => {
        setShowHistorial(showHistorial === index ? null : index);
    };

    const duplicarItem = async (index, e) => {
        const itemToDuplicate = items[index];
        const duplicatedItem = { ...itemToDuplicate };
        const newItems = [...items, duplicatedItem];
        setItems(newItems);
    };

    const agregarItem = (e) => {
        e.preventDefault();
        if (items.length < 4) {
            setItems([...items, { cantidad: "", descripcion: "" }]);
        } else {
            alert("No se pueden agregar más de 4 items.");
        }
    };
    return (
        <div className="mx-auto max-w-6xl p-4 text-black">

            <div className="bg-white p-6 rounded-md shadow-md">

                <div className="flex items-center justify-center mb-6 w-full h-11mb-6 bg-green-500 p-3 rounded-md text-white">
                    <label className="text-2xl font-bold text-white text-center">Llenado Exclusivo para el DEP MSG:</label>
                </div>
                <div className="text-center">
                    <div>
                        <label className="block text-center text-sm font-medium mb-1">
                            Seleccione la fecha de atencion:
                        </label>
                    </div>
                    <input
                        type="date"
                        id="fechaAtencion"
                        name="fechaAtencion"
                        className="text-black p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        value={fechaAtencion}
                        required
                        onChange={(e) => setFechaAtencion(e.target.value)}
                    />
                </div>

                <div className="bg-white p-6 text-black">
                    {items.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-6 mb-4">
                            <div className="col-span-3">
                                <label className="block text-sm font-medium mb-1">Cantidad:</label>
                                <input
                                    type="number"
                                    id={`items[${index}][cantidad]`}
                                    name={`items[${index}][cantidad]`}
                                    placeholder="Ingrese una cantidad"
                                    className="w-full text-black p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    value={item.cantidad}
                                    required
                                    onChange={(e) => {
                                        const newItems = [...items];
                                        newItems[index].cantidad = e.target.value;
                                        setItems(newItems);
                                    }}
                                />
                            </div>
                            <div className="col-span-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Descripción del bien solicitado:
                                </label>
                                <textarea
                                    name={`items[${index}][descripcion]`}
                                    className="p-3 text-black w-full rounded-md resize-none border border-gray-400"
                                    placeholder="Ingrese la descripción"
                                    required
                                    value={item.descripcion}
                                    ref={(el) => (descripcionRefs.current[index] = el)}
                                    onChange={(e) => {
                                        const newItems = [...items];
                                        newItems[index].descripcion = e.target.value;
                                        setItems(newItems);
                                    }}
                                    onClick={() => toggleHistorial(index)}

                                />
                                {showHistorial === index && (
                                    <div
                                        className="absolute z-10 bg-white p-3 rounded-md border border-gray-300 shadow-lg mt-2 max-h-40 overflow-y-auto"
                                        style={{ width: descripcionRefs.current[index]?.offsetWidth }}
                                    >
                                        {item.historial && item.historial.length > 0 ? (
                                            item.historial.map((hist, histIndex) => (
                                                <div key={histIndex} className="mb-2">
                                                    <span
                                                        className="text-sm cursor-pointer"
                                                        onClick={() => {
                                                            const newItems = [...itemsH];
                                                            newItems[index].descripcion = hist;
                                                            setItemsH(newItems);
                                                            setShowHistorial(null);
                                                        }}

                                                    >
                                                        {hist}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-sm text-gray-500">No hay historial disponible.</div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="col-span-3 flex flex-col items-center">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Acción:</label>
                                <div className="space-x-5">
                                    <button className="text-red-500 hover:text-red-700" onClick={() => eliminarItem(index)}>
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </button>
                                    <button className="text-blue-500 hover:text-blue-700" onClick={() => duplicarItem(index)}>
                                        <FontAwesomeIcon icon={faClone} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-center">
                        <button
                            className="bg-green-500 hover:bg-green-700 text-white font-bold mt px-6 py-3 rounded-md border border-black"
                            onClick={agregarItem}
                        >
                            Agregar Item
                        </button>
                    </div>
                </div>
                <div className="mb-1">
                    <label className="block text-sm font-medium mb-1">
                        Observaciones y/o diagnóstico técnico:
                    </label>
                </div>
                <textarea
                    className="p-3 text-black w-full rounded-md resize-none border border-gray-400"
                    id="obs"
                    required
                    name="obs"
                    {...register("obs")}
                />
                <div className="flex justify-center mt-4">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-2 px-6 py-3 rounded-md border border-black"
                    >
                        Actualizar
                    </button>
                </div>
            </div>

        </div>


    );
};
