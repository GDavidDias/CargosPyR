import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchConfig } from "../../utils/fetchConfig";
import { setConfig, setConfigComp, setEspecialidadVisorTit, setNivel } from "../../redux/configSlice";
import { useNavigate } from "react-router-dom";
import ModalUser from "../../components/ModalUser/ModalUser";
import Modal from "../../components/Modal/Modal";
import { useModal } from "../../hooks/useModal";
import { IoMdEyeOff } from "react-icons/io";
import { conexion } from "../../utils/conexion";
import { outUser, setUser } from "../../redux/userSlice";
import logo from '../../assets/JUNTA-04-xs.png';
import { changepass } from "../../utils/changepass";
import { fetchConfigComponente } from "../../utils/fetchConfigComponente";
import { fetchConfigEspVisorTit } from "../../utils/fetchConfigEspVisorTit";


const Landing = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const configSG = useSelector((state)=>state.config);

    //E.L de Ventanas Modales
    const[isOpenModal,openModal,closeModal]=useModal(false);
    const[mensajeModalInfo, setMensajeModalInfo] = useState("");

    const[isOpenModalChangePass,openModalChangePass,closeModalChangePass]=useModal(false);
    const[mensajeErrorModalChangeInfo, setMensajeErrorModalChangeInfo] = useState("");
    const[errorValida, setErrorValida] = useState(false);

    const[mensajeLogin, setMensajeLogin]=useState("");

    const[ver,setVer]=useState(false);

    const[form,setForm]=useState({
        username:'',
        password:''
    });

    const[formChangePass, setFormChangePass]=useState({
        username:'',
        password:'',
        newpassword:''
    });

    const handleChangePass = (event) =>{
        const{name, value} = event.target;
        setFormChangePass({
            ...formChangePass,
            [name]:value.toUpperCase()
        })
    };

    const handleChange = (event)=>{
        const{name,value} = event.target;
        //console.log(name, value)
        if(name=='username'){
            setForm({...form,[name]:value.toUpperCase()});
        }
        if(name=='password'){
            setForm({...form,[name]:value});
        }
    };

    const handleVer=()=>{
        setVer(!ver);
    };

    const handleKeyPress = (event)=>{
        if(event.key==='Enter'){
            document.getElementById("botonEnter")?.click();
            submitHandler();
        }
    };

    const submitHandler = async()=>{
        //console.log('que tiene form: ', form);
        if(form.username==="" || form.password===""){
            setMensajeLogin("Ingrese Usuario y Contraseña");
        }else{

            const datavalida = await conexion(form);
            //console.log('que tiene datavalida: ', datavalida);
            if(datavalida.length!=0){
                dispatch(setUser(datavalida));
                if(datavalida[0].nivel===1){
                    //USUARIO DE NIVEL INICIAL
                    const datosNivel=[{id_nivel:1, descripcion:'INICIAL'}];
                    dispatch(setNivel(datosNivel));
                }else if(datavalida[0].nivel===2){
                    //USUARIO DE NIVEL PRIMARIO
                    const datosNivel=[{id_nivel:2, descripcion:'PRIMARIO'}];
                    dispatch(setNivel(datosNivel));
                }else if(datavalida[0].nivel===3){
                    //SI ES ADMINISTRADOR INGRESA A PRIMARIO Y PODRA CAMBIAR DE NIVEL DENTRO
                    const datosNivel=[{id_nivel:2, descripcion:'PRIMARIO'}];
                    dispatch(setNivel(datosNivel));
                }
                navigate('/home');
            }else{
                setMensajeLogin("Usuario o Contraña Invalidos")
                dispatch(outUser());
            }
        }
    };


    const submitNivelInicial = async() =>{
        let formInvitado = {
            username:'invitadoIni',
            password:'invitadoIni'
        };

        //console.log('Presiono Docente Inicial');
        const datosNivel=[{id_nivel:1, descripcion:'INICIAL'}];
        dispatch(setNivel(datosNivel));

        const datavalida = await conexion(formInvitado);
        if(datavalida.length!=0){
            dispatch(setUser(datavalida));
            navigate('/home');
        }else{
            dispatch(outUser());
        }
    };

    const submitNivelPrimario = async()=>{
        let formInvitado = {
            username:'invitadoPri',
            password:'invitadoPri'
        };

        //console.log('Presiono Nivel Primario');
        const datosNivel=[{id_nivel:2, descripcion:'PRIMARIO'}];
        dispatch(setNivel(datosNivel));

        const datavalida = await conexion(formInvitado);
        if(datavalida.length!=0){
            dispatch(setUser(datavalida));
            navigate('/home');
        }else{
            dispatch(outUser());
        }
    };

    const getConfiguracion = async() =>{
        /**Trae la configuracion de funcionalidad de asignacion */
        const data = await fetchConfig();
        //console.log('que trae configuracion: ', data);
        dispatch(setConfig(data));

        /**Trae la configuracion de los componentes */
        const dataComp = await fetchConfigComponente();
        //console.log('que trae fetchConfigComponente: ', dataComp);
        dispatch(setConfigComp(dataComp));

        /**Trae configuracion de Especialidad para Visor de Vacantes */
        const dataEspeVisorVac = await fetchConfigEspVisorTit();
        //console.log('que trae fetchConfigEspVisorTit: ', dataEspeVisorVac);
        dispatch(setEspecialidadVisorTit(dataEspeVisorVac));
    };

    const ModalChangePass = ()=>{
        setForm({
            username:'',
            password:''
        })
        openModalChangePass();
        setMensajeErrorModalChangeInfo('Con usuario y contraseña actual');
        setErrorValida(false);
    };

    //PRESIONO BOTON ACEPTAR DE MODALUSER CAMBIO CONTRASEÑA
    const submitAceptarChangePass =async()=>{
        if(formChangePass.newpassword===''){
            setMensajeErrorModalChangeInfo('Ingrese una Nueva Contraseña');
            setErrorValida(true);
        }else{
            const datavalida = await conexion(formChangePass);
            //console.log('que trae datavalida: ', datavalida);
            if(datavalida.length!=0){
                //dispatch(setUser(datavalida));
                //console.log('que tiene formChangePass: ', formChangePass);
                //SI VALIDA USUARIO
                const result = await changepass(formChangePass);
                if(result.length!=0){
                    //llamo a modal mensaje cambio correcto, ingrese a sistema.
                    setMensajeModalInfo('Cambio de contraseña exitoso, ingrese al sistema');
                    openModal();
                }
                
            }else{
                setMensajeErrorModalChangeInfo('Usuario o Contraseña Invalido');
                setErrorValida(true);
                dispatch(outUser())
            }
        }
    };

    const submitCloseModal = ()=>{
        closeModal();
        closeModalChangePass();
        setFormChangePass({
            username:'',
            password:'',
            newpassword:''
        })
    };

    const CancelChangePass = ()=>{
        setFormChangePass({
            username:'',
            password:'',
            newpassword:''      
        })
        closeModalChangePass();
    };



    useEffect(()=>{
        //console.log('que tiene configSG: ', configSG);
    },[configSG])
        
    useEffect(()=>{ 
        //Se carga la tabla de configuracion
        getConfiguracion();
        setMensajeLogin("Ingrese Usuario y Contraseña")
        //openModalNivel();
    },[])

    return(
        <div className="flex flex-col items-center">
            <div className="h-[15vh] flex flex-row justify-center items-center bg-[#729DA6] border border-b-slate-400 w-full shadow-md ">
                <div className="desktop:w-[90px] desktop:h-[90px] movil:w-[80px] movil:h-[80px] flex justify-center ">
                    <img className="desktop:w-[90px] desktop:h-[90px] movil:w-[80px] movil:h-[80px]" src={logo}/>
                </div>
                <div className="h-28  flex flex-col pl-4 justify-center items-center">
                    <label className="desktop:text-[38px] movil:text-xl font-bold text-white" translate='no'>Sistema Entrega de Cargos</label>
                    {/* <label className="desktop:text-[25px] movil:text-lg text-white font-semibold mt-4" translate='no'>Nivel {configSG.nivel?.descripcion}</label> */}
                    <label className="desktop:text-[25px] movil:text-2xl text-white font-semibold mt-4" translate='no'>Nivel Primario</label>
                </div>
            </div>

            {/* <div className="desktop:h-[50vh] flex flex-col justify-center items-center  bg-[#FFFEFC]  border-2 border-[#729DA6] desktop:w-[55vw] movil:w-full movil:h-[50vh] rounded-lg mt-10 shadow-lg  p-4 "> */}
            <div className="desktop:h-[50vh] flex flex-col justify-center items-center  bg-[#FFFEFC]   desktop:w-[55vw] movil:w-full movil:h-[50vh] rounded-lg mt-10   p-4 ">
                <label className="text-[#729DA6] font-medium text-[20px] mb-4 desktop-xl:text-3xl " translate='no'>Ingresar al Sistema</label>
                <div className="flex flex-col items-center">
                    {/* PARTE IZQUIERDA INGRESO INVITADOS */}
                    {/* <div className="border-2 border-[#729DA6] desktop:w-[25vw] movil:w-[60vw] text-center mx-2 rounded-md">
                        <h1 className="font-semibold mt-2 text-[17px] desktop-xl:text-2xl">Entrega de Cargos</h1>
                        <h1 className=" mt-2 text-[17px] desktop-xl:text-xl">(Ingreso Docentes)</h1>
                        <div className="flex flex-col mt-4">
                            <div className="my-4">
                                <button
                                    className=" w-40 h-8 bg-[#758C51] my-2 px-2 py-1 text-base font-medium text-white hover:bg-[#c9d991] shadow-md rounded mx-2 desktop-xl:h-10 desktop-xl:text-xl"
                                    onClick={submitNivelInicial}
                                    translate='no'
                                    id="botonEnter"
                                >Sala INICIAL</button>
                            </div>
                            <div>
                                <button
                                    className="w-40 h-8 bg-[#758C51] my-2 px-2 py-1 text-base font-medium text-white hover:bg-[#c9d991] shadow-md rounded mx-2 desktop-xl:h-10 desktop-xl:text-xl"
                                    onClick={submitNivelPrimario}
                                    translate='no'
                                    id="botonEnter"
                                >Sala PRIMARIA</button>
                            </div>
                        </div>

                    </div> */}
                    <div>
                        <button
                            className="w-[50mm] h-8 bg-[#758C51] my-2 px-2 py-1 text-base font-medium text-white hover:bg-[#c9d991] shadow-md rounded mx-2 desktop-xl:w-[15vw] desktop-xl:h-10 desktop-xl:text-xl"
                            onClick={submitNivelPrimario}
                            //onClick={submitNivelInicial}
                            translate='no'
                            id="botonEnter"
                        >Ingreso DOCENTES</button>
                    </div>

                    {/* PARTE DERECHA INGRESO USUARIOS JPCD */}
                    {/* SOLO APARECE EN MODO DESKTOP, NOVIL NO */}
                    <div className="movil:hidden desktop:flex desktop:flex-col border-2 border-[#729DA6] w-[25vw]  text-center mx-2 rounded-md">
                        <h1 className="font-semibold mt-2 text-[17px] desktop-xl:text-2xl">Ingreso usuarios JPCD</h1>
                        <label className="text-sm text-red-500 italic desktop-xl:text-lg">{mensajeLogin}</label>
                        <div className="flex flex-row mt-4 mb-4 justify-center">
                            <div className="flex flex-col ">
                                <label className="text-base desktop-xl:text-xl">Usuario:</label>
                                <input
                                    className="mx-2 border-[1px] border-black rounded px-2 w-[200px] desktop-xl:text-xl"
                                    value={form.username}
                                    onChange={handleChange}
                                    name="username"
                                    type="text"
                                ></input>
                                <label className="mt-2 text-base desktop-xl:text-xl">Contraseña:</label>
                                <div className="flex flex-row items-center border-[1px] border-black rounded mx-2 ">
                                    <input
                                        className="ml-2 w-[176px] focus:outline-none desktop-xl:text-xl"
                                        value={form.password}
                                        onChange={handleChange}
                                        name="password"
                                        type={ver ? 'text' :'password'}      
                                        onKeyPress={handleKeyPress}
                                    ></input>
                                    <IoMdEyeOff className="desktop-xl:text-xl" onClick={()=>handleVer()}/>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <label
                                className="text-sky-500 hover:text-sky-800 hover:cursor-pointer desktop-xl:text-lg"
                                onClick={()=>ModalChangePass()}
                            >Cambiar Contraseña</label>
                            <button
                                className="w-40 h-8 bg-[#729DA6] my-2 px-2 py-1 text-base font-medium text-white hover:bg-[#6A88F7] shadow-md rounded desktop-xl:h-10 desktop-xl:text-xl"
                                onClick={submitHandler}
                                translate='no'
                                id="botonEnter"
                            >Acceder</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL PARA CAMBIO CONTRASEÑA */}
            <ModalUser isOpen={isOpenModalChangePass} closeModal={closeModalChangePass}>
                <div className="mt-4 mb-4 w-72 text-center">
                    <h1 className="text-xl text-center font-bold">Cambiar Contraseña</h1>
                    <label 
                        className={`italic
                                ${(errorValida)
                                    ?`text-red-500`
                                    :`text-black`
                                }
                            `}
                    >{mensajeErrorModalChangeInfo}</label>
                    <div className="flex flex-col items-center ">
                        <div className="mt-4 flex flex-col items-start">
                            <label>Usuario: </label>
                            <input
                                name="username"
                                type="text"
                                className="border-[1px] border-gray-400 h-[10mm] w-[62mm] pl-2 focus:outline-none"
                                value={formChangePass.username}
                                onChange={handleChangePass}
                            ></input>
                        </div>
                        <div className="mt-4 flex flex-col items-start">
                            <label>Contraseña Actual:</label>
                            <div className="flex flex-row items-center border-[1px] border-gray-400 h-[11mm] w-[62mm] ">
                                <input
                                    name="password"
                                    type={ver ?'text' :'password'}
                                    className="h-[10mm] w-[52mm] ml-2 focus:outline-none"
                                    value={formChangePass.password}
                                    onChange={handleChangePass}
                                ></input>
                                <IoMdEyeOff onClick={()=>handleVer()} className="text-xl"/>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-col items-start">
                            <label>Nueva Contraseña:</label>
                            <div className="flex flex-row items-center border-[1px] border-gray-400 h-[11mm] w-[62mm] ">
                                <input
                                    name="newpassword"
                                    type={ver ?'text' :'password'}
                                    className="h-[10mm] w-[52mm] ml-2 focus:outline-none"
                                    value={formChangePass.newpassword}
                                    onChange={handleChangePass}
                                ></input>
                                <IoMdEyeOff onClick={()=>handleVer()} className="text-xl"/>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center mt-4">
                        <button
                            className="border-2 border-[#729DA6] my-2 font-medium w-40 h-8 bg-[#729DA6] text-white hover:bg-[#6A88F7] rounded"
                            onClick={()=>submitAceptarChangePass()}
                            >Aceptar</button>
                        <label
                            className="text-sky-500 hover:text-sky-800 hover:cursor-pointer"
                            onClick={()=>CancelChangePass()}
                        >Cancelar</label>
                    </div>
                </div>
            </ModalUser>
            
            {/* MODAL DE MENSAJES */}
            <Modal isOpen={isOpenModal} closeModal={closeModal}>
                <div className="mt-10 w-72">
                    <h1 className="text-xl text-center font-bold">{mensajeModalInfo}</h1>
                    <div className="flex justify-center">
                        <button
                            className="border-2 border-[#729DA6] mt-10 font-bold w-40 h-8 bg-[#729DA6] text-white hover:bg-[#6A88F7] "
                            onClick={()=>submitCloseModal()}
                        >OK</button>
                    </div>
                </div>
            </Modal>

        </div>
    )
};

export default Landing;